export interface WalletStats {
  address: string;
  age: number; // in days
  txCount: number;
  totalVolume: number; // in ETH
  defiActivity: number; // 0-100
  nftInteractions: number;
  consistencyScore: number; // 0-100
  airdropScore: number; // 0-100
}

export function calculateReputation(stats: WalletStats) {
  const { age, txCount, defiActivity, nftInteractions, consistencyScore } = stats;
  
  // Weighted scoring
  const reputationScore = (
    (Math.min(age, 365) / 365) * 20 + // Age (max 1 year) - 20%
    (Math.min(txCount, 100) / 100) * 25 + // Transactions - 25%
    (defiActivity / 100) * 20 + // DeFi - 20%
    (Math.min(nftInteractions, 50) / 50) * 15 + // NFTs - 15%
    (consistencyScore / 100) * 20 // Consistency - 20%
  );
  
  return Math.round(reputationScore);
}

export function getBadge(score: number) {
  if (score >= 90) return { name: 'Titan', color: 'text-neon-purple', bg: 'bg-neon-purple/10' };
  if (score >= 75) return { name: 'Whale', color: 'text-neon-blue', bg: 'bg-neon-blue/10' };
  if (score >= 50) return { name: 'Explorer', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  if (score >= 25) return { name: 'Novice', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  return { name: 'Newbie', color: 'text-gray-400', bg: 'bg-gray-400/10' };
}

export const mockLeaderboard = [
  { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', score: 98, badge: 'Titan' },
  { address: '0x21C7656EC7ab88b098defB751B7401B5f6d8976A', score: 94, badge: 'Titan' },
  { address: '0x31C7656EC7ab88b098defB751B7401B5f6d8976B', score: 88, badge: 'Whale' },
  { address: '0x41C7656EC7ab88b098defB751B7401B5f6d8976C', score: 82, badge: 'Whale' },
  { address: '0x51C7656EC7ab88b098defB751B7401B5f6d8976D', score: 76, badge: 'Whale' },
];
