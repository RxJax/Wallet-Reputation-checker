'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, ArrowUpRight, Crown, RefreshCw } from 'lucide-react';
import { mockLeaderboard } from '@/lib/scoring';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  address: string;
  score: number;
  badge: string;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    // Initialize directly from localStorage to avoid setState in effect
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('walletgrade_leaderboard');
      if (stored) return JSON.parse(stored);
      const initial = mockLeaderboard;
      localStorage.setItem('walletgrade_leaderboard', JSON.stringify(initial));
      return initial;
    }
    return mockLeaderboard;
  });

  useEffect(() => {
    // Listener for new submissions from Dashboard
    const handleUpdate = () => {
      const updated = localStorage.getItem('walletgrade_leaderboard');
      if (updated) setEntries(JSON.parse(updated));
    };

    window.addEventListener('leaderboardUpdated', handleUpdate);
    return () => window.removeEventListener('leaderboardUpdated', handleUpdate);
  }, []);

  return (
    <div id="leaderboard" className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="glass-morphism p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Global Leaderboard
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm text-white/40">Live Rankings</p>
            </div>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new Event('leaderboardUpdated'))}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
          >
            <RefreshCw className="w-4 h-4 text-white/40 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
                <th className="pb-4 font-medium">Rank</th>
                <th className="pb-4 font-medium">Wallet Address</th>
                <th className="pb-4 font-medium">Reputation</th>
                <th className="pb-4 font-medium">Badge</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.sort((a, b) => b.score - a.score).map((item, index) => (
                <motion.tr 
                  key={`${item.address}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black italic ${index < 3 ? 'text-neon-blue' : 'text-white/20'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {index === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="font-mono text-white/80 group-hover:text-white transition-colors">
                      {item.address.slice(0, 6)}...{item.address.slice(-4)}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neon-blue" 
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="font-bold">{item.score}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-neon-blue/20 bg-neon-blue/5 text-neon-blue`}>
                      {item.badge}
                    </span>
                  </td>
                  <td className="py-6 text-right">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-white/40" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
