import { WalletStats } from './scoring';

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const COVALENT_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY;

export async function fetchWalletData(address: string): Promise<WalletStats> {
  if (!address.startsWith('0x') || address.length !== 42) {
    throw new Error('Invalid wallet address');
  }

  try {
    const [alchemyData, covalentData] = await Promise.all([
      fetchAlchemyData(address),
      fetchCovalentData(address)
    ]);

    // Calculate age in days
    const firstTxDate = new Date(alchemyData.firstTxTimestamp);
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24));

    // Scoring logic
    const defiScore = Math.min((covalentData.defiInteractions / 10) * 100, 100);
    const consistencyScore = Math.min((alchemyData.txCount / 50) * 100, 100);

    return {
      address,
      age: ageInDays,
      txCount: alchemyData.txCount,
      totalVolume: covalentData.totalValueUsd, // Using USD for simplicity in this dashboard
      defiActivity: defiScore,
      nftInteractions: covalentData.nftCount,
      consistencyScore: consistencyScore,
      airdropScore: calculateAirdropScore(ageInDays, alchemyData.txCount, defiScore)
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    throw error;
  }
}

async function fetchAlchemyData(address: string) {
  // Get Tx Count
  const txCountRes = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionCount',
      params: [address, 'latest']
    })
  });
  const txCountData = await txCountRes.json();
  const txCount = parseInt(txCountData.result, 16);

  // Get First Transaction (simplified: getting first transfer)
  const transfersRes = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromAddress: address,
        category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
        order: 'asc',
        maxCount: '0x1'
      }]
    })
  });
  const transfersData = await transfersRes.json();
  const firstTxTimestamp = transfersData.result?.transfers[0]?.metadata?.blockTimestamp || new Date().toISOString();

  return { txCount, firstTxTimestamp };
}

async function fetchCovalentData(address: string) {
  // Get Token Balances and NFT data
  const res = await fetch(`https://api.covalenthq.com/v1/eth-mainnet/address/${address}/balances_v2/?key=${COVALENT_KEY}`);
  const data = await res.json();
  
  const items: { quote?: number; type?: string; native_token?: boolean }[] = data.data?.items || [];
  const totalValueUsd = items.reduce((acc: number, item) => acc + (item.quote || 0), 0);
  const nftCount = items.filter((item) => item.type === 'nft').length;
  
  // Estimate DeFi interactions (simplified: count of non-native token balances as a proxy for activity)
  const defiInteractions = items.filter((item) => !item.native_token && item.type !== 'nft').length;

  return { totalValueUsd, nftCount, defiInteractions };
}

function calculateAirdropScore(age: number, txs: number, defi: number) {
  let score = 0;
  if (age > 365) score += 30;
  else if (age > 180) score += 15;
  
  if (txs > 100) score += 40;
  else if (txs > 20) score += 20;
  
  if (defi > 50) score += 30;
  else if (defi > 10) score += 15;
  
  return score;
}
