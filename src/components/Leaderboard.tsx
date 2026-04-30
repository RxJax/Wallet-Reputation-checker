'use client';

import { Trophy, ArrowUpRight, Crown } from 'lucide-react';
import { mockLeaderboard } from '@/lib/scoring';
import { motion } from 'framer-motion';

export function Leaderboard() {
  return (
    <div id="leaderboard" className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="glass-morphism p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Global Leaderboard
            </h3>
            <p className="text-sm text-white/40 text-nowrap">Highest reputation wallets on-chain</p>
          </div>
          <button className="text-sm font-bold text-neon-blue hover:neon-text-blue flex items-center gap-1 transition-all">
            View All <ArrowUpRight className="w-4 h-4" />
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
              {mockLeaderboard.map((item, index) => (
                <motion.tr 
                  key={item.address}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
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
