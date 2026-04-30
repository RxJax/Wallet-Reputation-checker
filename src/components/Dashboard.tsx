'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Layers, 
  Image as ImageIcon, 
  Calendar, 
  Award,
  Search,
  ExternalLink
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
import { motion } from 'framer-motion';
import { getBadge } from '@/lib/scoring';

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
  const activeAddress = address || inputAddress;

  const stats = {
    score: 84,
    age: '2.4 Years',
    txs: 1452,
    defi: 'High',
    nfts: 42,
    consistency: '88%',
    airdropScore: 72
  };

  const badge = getBadge(stats.score);

  return (
    <div id="dashboard" className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Search Bar */}
      {!address && (
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
              />
              <button className="bg-neon-blue text-black font-bold px-6 py-2 rounded-lg hover:shadow-neon-blue transition-all duration-300">
                Analyze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Reputation Score" 
          value={stats.score} 
          icon={<Award className="w-5 h-5" />} 
          color="neon-blue" 
          suffix="/100"
        />
        <StatCard 
          title="Wallet Age" 
          value={stats.age} 
          icon={<Calendar className="w-5 h-5" />} 
          color="neon-purple" 
        />
        <StatCard 
          title="Total Transactions" 
          value={stats.txs} 
          icon={<Activity className="w-5 h-5" />} 
          color="neon-blue" 
        />
        <StatCard 
          title="Airdrop Score" 
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
              Activity History
            </h3>
            <span className="text-xs text-white/40 uppercase tracking-widest">Last 6 Months</span>
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
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00f3ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown & Badge */}
        <div className="space-y-8">
          <div className="glass-morphism p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-neon-purple" />
              Breakdown
            </h3>
            <div className="space-y-4">
              <ProgressBar label="DeFi Activity" value={85} color="bg-neon-blue" />
              <ProgressBar label="NFT Collection" value={62} color="bg-neon-purple" />
              <ProgressBar label="Consistency" value={88} color="bg-emerald-400" />
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
            <p className="text-xs text-white/60">Top 5% of all analyzed wallets</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, suffix = '' }: any) {
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
        <span className="text-white">{value}%</span>
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
