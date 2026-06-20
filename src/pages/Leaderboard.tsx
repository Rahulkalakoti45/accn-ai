import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Search, Lock, User as UserIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../utils/theme';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Leaderboard: React.FC = () => {
  const theme = useTheme();
  const { leaderboard, walletCredits } = useStore();
  const [filter, setFilter] = useState<'month' | 'all' | 'state'>('month');

  // Trigger confetti for the first place podium on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.35, y: 0.7 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.65, y: 0.7 }
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Compute badge unlocks based on active walletCredits
  const badges = [
    { id: 'b1', name: 'Beginner', desc: 'First credit earned', req: 1, icon: '🌱', color: '#10B981' },
    { id: 'b2', name: 'Energy Saver', desc: '10+ credits earned', req: 10, icon: '⚡', color: '#00D4FF' },
    { id: 'b3', name: 'Eco Warrior', desc: '50+ credits earned', req: 50, icon: '🌍', color: '#7C3AED' },
    { id: 'b4', name: 'Green Hero', desc: '100+ credits earned', req: 100, icon: '🏆', color: '#F59E0B' },
    { id: 'b5', name: 'Platinum', desc: '500+ credits earned', req: 500, icon: '💎', color: '#E2E8F0' },
    { id: 'b6', name: 'Legend', desc: 'Top 10 all-time index', req: 1000, icon: '🌟', color: '#D97706' },
  ];

  // Podium users (ranks 1, 2, 3)
  const rank1 = leaderboard.find((u) => u.rank === 1);
  const rank2 = leaderboard.find((u) => u.rank === 2);
  const rank3 = leaderboard.find((u) => u.rank === 3);

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">Grid Leaderboards</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Compete with households and industrial grids saving emission metrics.
          </p>
        </div>
      </div>

      {/* 3D Podium container */}
      <div className="w-full py-10 rounded-2xl border border-cardBorder bg-cardSurface/20 relative overflow-hidden glass-panel flex justify-center items-end min-h-[300px] gap-4 sm:gap-8 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,255,136,0.02)_0%,transparent_60%)] pointer-events-none" />

        {/* Rank 2 Podium (Left) */}
        {rank2 && (
          <div className="flex flex-col items-center z-10 w-24 sm:w-28 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="w-12 h-12 rounded-full border border-accentCyan/30 bg-cardSurface flex items-center justify-center text-accentCyan text-lg shadow-neon-cyan/10 mb-2 relative"
            >
              🥈
            </motion.div>
            <span className="text-xs font-bold text-white truncate max-w-full">{rank2.name.split(' ')[0]}</span>
            <span className="text-[10px] font-mono text-accentCyan mt-0.5">{rank2.credits} CR</span>
            {/* Podium pillar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 80 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full bg-cardSurface/60 border border-cardBorder border-b-0 rounded-t-xl mt-3 flex items-center justify-center font-mono font-bold text-textMuted text-lg h-20"
            >
              #2
            </motion.div>
          </div>
        )}

        {/* Rank 1 Podium (Center - Tallest) */}
        {rank1 && (
          <div className="flex flex-col items-center z-10 w-28 sm:w-32 text-center">
            {/* Pulsing crown badge above 1st */}
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-2xl mb-1 block select-none"
            >
              👑
            </motion.span>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-full border-2 border-accentGreen bg-cardSurface flex items-center justify-center text-2xl shadow-neon-green/30 mb-2 relative"
            >
              🥇
              {/* Outer rotating ring */}
              <div className="absolute -inset-1.5 border border-accentGreen/20 rounded-full animate-spin" />
            </motion.div>
            <span className="text-xs font-extrabold text-white truncate max-w-full">{rank1.name.split(' ')[0]}</span>
            <span className="text-[10px] font-mono text-accentGreen font-bold mt-0.5">{rank1.credits} CR</span>
            {/* Podium pillar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 110 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full bg-cardSurface/80 border-2 border-accentGreen border-b-0 rounded-t-xl mt-3 flex items-center justify-center font-mono font-bold text-accentGreen text-xl h-28"
            >
              #1
            </motion.div>
          </div>
        )}

        {/* Rank 3 Podium (Right) */}
        {rank3 && (
          <div className="flex flex-col items-center z-10 w-24 sm:w-28 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="w-12 h-12 rounded-full border border-accentGold/30 bg-cardSurface flex items-center justify-center text-accentGold text-lg shadow-neon-gold/10 mb-2 relative"
            >
              🥉
            </motion.div>
            <span className="text-xs font-bold text-white truncate max-w-full">{rank3.name.split(' ')[0]}</span>
            <span className="text-[10px] font-mono text-accentGold mt-0.5">{rank3.credits} CR</span>
            {/* Podium pillar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 60 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full bg-cardSurface/60 border border-cardBorder border-b-0 rounded-t-xl mt-3 flex items-center justify-center font-mono font-bold text-textMuted text-lg h-15"
            >
              #3
            </motion.div>
          </div>
        )}
      </div>

      {/* Filter Tabs & Table Section */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cardBorder pb-4">
          <div className="flex gap-2 select-none">
            <button
              onClick={() => setFilter('month')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === 'month' ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/30' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === 'all' ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/30' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('state')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === 'state' ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/30' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              My City
            </button>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cardBorder/50 font-mono text-textMuted uppercase select-none">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Trust Score</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr
                  key={row.rank}
                  className={`border-b border-cardBorder/30 transition-colors ${
                    row.isCurrentUser 
                      ? 'bg-accentGreen/5 border-l-4 border-l-accentGreen' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-4 px-4 font-mono font-bold">{row.rank}</td>
                  <td className="py-4 px-4 font-semibold text-white">
                    <span className="flex items-center gap-2">
                      {row.isCurrentUser && <span className="w-1.5 h-1.5 rounded-full bg-accentGreen" />}
                      {row.name} {row.isCurrentUser && '(You)'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-white">{row.credits} CR</td>
                  <td className="py-4 px-4 font-mono text-accentGreen font-bold">{row.trustScore}%</td>
                  <td className="py-4 px-4 font-mono text-lg">{row.badges.join(' ')}</td>
                  <td className="py-4 px-4 text-right font-mono font-bold">
                    {row.trend === 'up' && <span className="text-accentGreen">&uarr; (+1)</span>}
                    {row.trend === 'down' && <span className="text-danger">&darr; (-1)</span>}
                    {row.trend === 'same' && <span className="text-textMuted">&mdash;</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gamified Badge Cabinet */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-5 glass-panel">
        <h3 className="text-sm font-bold text-white font-heading select-none">
          Achievements Cabinet
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((b) => {
            // Check unlocked: user baseline credits = 25.5, podium credits add baseline
            const totalRankCredits = walletCredits + 100; // matching leaderboard baseline
            const isUnlocked = totalRankCredits >= b.req;
            const progressRatio = Math.min((totalRankCredits / b.req) * 100, 100);

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex flex-col justify-between items-center text-center gap-3 transition-all relative ${
                  isUnlocked
                    ? 'border-accentGreen/20 bg-accentGreen/5 hover:scale-105'
                    : 'border-cardBorder bg-cardSurface/20 opacity-40'
                }`}
              >
                {!isUnlocked && (
                  <Lock className="w-3.5 h-3.5 text-textMuted absolute top-3 right-3" />
                )}

                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: isUnlocked ? `${b.color}15` : 'transparent', border: isUnlocked ? `1px solid ${b.color}30` : '1px dashed #1E2D45' }}
                >
                  {b.icon}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white leading-none">{b.name}</h4>
                  <p className="text-[9px] text-textSecondary mt-1 leading-tight">{b.desc}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full flex flex-col gap-1 mt-1">
                  <div className="w-full h-1 bg-cardBorder rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accentGreen"
                      style={{ width: `${progressRatio}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-textMuted block">
                    {Math.round(totalRankCredits)}/{b.req} CR
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
