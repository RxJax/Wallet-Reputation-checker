'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, LayoutDashboard, Trophy, Github } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass-morphism px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 group-hover:neon-border-blue transition-all duration-300">
            <Shield className="w-6 h-6 text-neon-blue" />
          </div>
          <span className="text-xl font-bold tracking-tighter neon-text-blue">
            WalletGrade
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#dashboard" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-neon-blue transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="#leaderboard" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-neon-purple transition-colors">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton 
            accountStatus="avatar" 
            showBalance={false}
          />
        </div>
      </div>
    </nav>
  );
}
