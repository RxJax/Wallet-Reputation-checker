'use client';

import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { Leaderboard } from '@/components/Leaderboard';
import { Shield, Zap, Lock, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-dark-bg text-white selection:bg-neon-blue/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/10 blur-[120px] -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 blur-[120px] -z-10 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-bold uppercase tracking-widest"
          >
            <Zap className="w-3 h-3" />
            Revolutionizing On-Chain Reputation
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Know Your <span className="neon-text-blue">Wallet's</span> <br />
            True <span className="neon-text-purple italic">Worth.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-white/60 leading-relaxed"
          >
            The most advanced analytics platform for Web3 enthusiasts. 
            Analyze transactions, DeFi footprint, and airdrop eligibility in one futuristic dashboard.
          </motion.p>

          {!isConnected && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <button className="px-8 py-4 bg-neon-blue text-black font-black rounded-xl hover:shadow-neon-blue transition-all duration-300 flex items-center gap-2 group">
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
                How it Works
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <HeroStat label="Active Users" value="128K+" />
          <HeroStat label="Wallets Scanned" value="2.4M" />
          <HeroStat label="DeFi Protocols" value="450+" />
          <HeroStat label="NfT Collections" value="15K+" />
        </div>
      </section>

      {/* Analytics Dashboard */}
      <Dashboard address={address} />

      {/* Leaderboard */}
      <Leaderboard />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-white/40 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neon-blue" />
            <span className="font-bold text-white tracking-tight">WalletGrade</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
          </div>
          <p>© 2026 WalletGrade. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function HeroStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center space-y-1">
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{label}</p>
    </div>
  );
}
