'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Layers, 
  Calendar, 
  Award,
  Search,
  Loader2,
  AlertCircle,
  X as XIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getBadge, calculateReputation } from '@/lib/scoring';
import { fetchWalletData } from '@/lib/blockchain';
import { useQuery } from '@tanstack/react-query';

const chartData = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 22 },
  { name: 'May', value: 30 },
  { name: 'Jun', value: 25 },
  { name: 'Jul', value: 35 },
];

export function Dashboard({ address }: { address?: string }) {
  const [inputAddress, setInputAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState(address || '');

  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['walletData', searchAddress],
    queryFn: () => fetchWalletData(searchAddress),
    enabled: !!searchAddress,
    retry: false
  });

  useEffect(() => {
    if (stats) {
      const score = calculateReputation(stats);
      const badge = getBadge(score);
      
      const stored = localStorage.getItem('walletgrade_leaderboard');
      let leaderboard: { address: string; score: number; badge: string }[] = stored ? JSON.parse(stored) : [];
      
      // Check if already in leaderboard
      const index = leaderboard.findIndex((e) => e.address === stats.address);
      if (index !== -1) {
        leaderboard[index].score = Math.max(leaderboard[index].score, score);
      } else {
        leaderboard.push({ address: stats.address, score, badge: badge.name });
      }
      
      // Keep top 10
      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, 10);
      
      localStorage.setItem('walletgrade_leaderboard', JSON.stringify(leaderboard));
      window.dispatchEvent(new Event('leaderboardUpdated'));
    }
  }, [stats]);

  const handleSearch = () => {
    if (inputAddress) {
      setSearchAddress(inputAddress);
    }
  };

  const reputationScore = stats ? calculateReputation(stats) : 0;
  const badge = getBadge(reputationScore);

  return (
    <div id="dashboard" className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
          <div className="relative flex items-center bg-black rounded-xl border border-white/10 p-2">
            <Search className="w-5 h-5 text-white/40 ml-3" />
            <input 
              type="text" 
              placeholder="Paste wallet address (0x...)"
              className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-2 placeholder:text-white/20"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-neon-blue text-black font-bold px-6 py-2 rounded-lg hover:shadow-neon-blue transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-neon-purple/20 border-b-neon-purple rounded-full animate-spin-reverse"></div>
            </div>
            <p className="text-neon-blue font-mono animate-pulse">Syncing with Ethereum Mainnet...</p>
          </motion.div>
        ) : isError ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-8 border-red-500/30 flex flex-col items-center gap-4 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Analysis Failed</h3>
              <p className="text-white/60">{(error as Error)?.message || 'Check your API keys or wallet address and try again.'}</p>
            </div>
            <button 
              onClick={() => setSearchAddress('')}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        ) : stats ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Reputation Score" 
                value={reputationScore} 
                icon={<Award className="w-5 h-5" />} 
                color="neon-blue" 
                suffix="/100"
              />
              <StatCard 
                title="Wallet Age" 
                value={stats.age > 365 ? `${(stats.age / 365).toFixed(1)} Years` : `${stats.age} Days`} 
                icon={<Calendar className="w-5 h-5" />} 
                color="neon-purple" 
              />
              <StatCard 
                title="Transactions" 
                value={stats.txCount} 
                icon={<Activity className="w-5 h-5" />} 
                color="neon-blue" 
              />
              <StatCard 
                title="Airdrop Eligibility" 
                value={stats.airdropScore} 
                icon={<TrendingUp className="w-5 h-5" />} 
                color="neon-purple" 
                suffix="%"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Activity Graph */}
              <div className="lg:col-span-2 glass-morphism p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-32 h-32 text-neon-blue" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-blue" />
                    Portfolio Overview
                  </h3>
                  <span className="text-xs text-white/40 uppercase tracking-widest">Real-time data</span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="value" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Breakdown & Badge */}
              <div className="space-y-8">
                <div className="glass-morphism p-8 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="w-5 h-5 text-neon-purple" />
                    Activity Breakdown
                  </h3>
                  <div className="space-y-4">
                    <ProgressBar label="DeFi Activity" value={stats.defiActivity} color="bg-neon-blue" />
                    <ProgressBar label="NFT Collection" value={Math.min(stats.nftInteractions * 10, 100)} color="bg-neon-purple" />
                    <ProgressBar label="Consistency" value={stats.consistencyScore} color="bg-emerald-400" />
                  </div>
                </div>

                <div className="glass-morphism p-8 flex flex-col items-center justify-center text-center space-y-4 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[16px]"></div>
                  <div className={`w-20 h-20 rounded-full ${badge.bg} flex items-center justify-center border border-white/10 group-hover:neon-border-blue transition-all duration-500`}>
                    <Award className={`w-10 h-10 ${badge.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Rank Status</p>
                    <h4 className={`text-3xl font-black italic uppercase ${badge.color}`}>{badge.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {stats.defiActivity > 50 && <span className="px-2 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue text-[10px] font-bold">DEFI USER</span>}
                    {stats.nftInteractions > 0 && <span className="px-2 py-0.5 rounded-md bg-neon-purple/10 text-neon-purple text-[10px] font-bold">NFT COLLECTOR</span>}
                  </div>
                  <ShareSection score={reputationScore} badge={badge.name} address={stats.address} />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/40">Enter a wallet address or connect your wallet to start analysis.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, color, suffix = '' }: { title: string; value: string | number; icon: React.ReactNode; color: string; suffix?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-morphism p-6 space-y-4 relative overflow-hidden group hover:neon-border-blue transition-all duration-500"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color === 'neon-blue' ? 'bg-neon-blue/10 text-neon-blue' : 'bg-neon-purple/10 text-neon-purple'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-white/40 font-medium">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {suffix && <span className="text-sm text-white/40">{suffix}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-white/60">{label}</span>
        <span className="text-white">{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function ShareSection({ score, badge, address }: { score: number, badge: string, address: string }) {
  const shareText = `Just checked my Web3 reputation on WalletGrade! 🚀\n\nScore: ${score}/100\nRank: ${badge}\nWallet: ${address.slice(0, 6)}...${address.slice(-4)}\n\nCheck yours at walletgrade.io #Web3 #WalletGrade #Airdrop`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="pt-4 w-full">
      <a 
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black font-black rounded-xl hover:bg-neon-blue hover:shadow-neon-blue transition-all duration-300"
      >
        <XIcon className="w-5 h-5 fill-current" />
        Share Score on X
      </a>
    </div>
  );
}
