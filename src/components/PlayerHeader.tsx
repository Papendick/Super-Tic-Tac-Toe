import React from 'react';
import { motion } from 'motion/react';
import { useQuantumStore, getXpForCurrentLevel, getXpForNextLevel } from '../lib/store';
import { Shield, ShieldAlert, ShieldCheck, ShieldHalf, Star } from 'lucide-react';

const getRankDetails = (level: number) => {
  if (level < 5) return { title: 'Rookie', icon: Shield, color: 'text-slate-400' };
  if (level < 10) return { title: 'Veteran', icon: ShieldHalf, color: 'text-emerald-400' };
  if (level < 20) return { title: 'Elite', icon: ShieldCheck, color: 'text-cyan-400' };
  if (level < 50) return { title: 'Master', icon: ShieldAlert, color: 'text-rose-400' };
  return { title: 'Quantum Legend', icon: Star, color: 'text-amber-400' };
};

export function PlayerHeader() {
  const profile = useQuantumStore(state => state.profile);
  
  const currentLevelXp = getXpForCurrentLevel(profile.level);
  const nextLevelXp = getXpForNextLevel(profile.level);
  const xpInCurrentLevel = profile.xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const rank = getRankDetails(profile.level);
  const RankIcon = rank.icon;

  return (
    <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/30 shadow-[0_0_40px_rgba(0,0,0,0.3)] mb-6 z-10">
      
      {/* Level & XP */}
      <div className="flex-1 w-full flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(34,211,238,0.2)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-50" />
          <span className="text-cyan-400 font-black text-xl z-10">{profile.level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest mb-2">
            <div className="flex items-center gap-2">
              <RankIcon className={`w-4 h-4 ${rank.color}`} />
              <span className={rank.color}>{rank.title}</span>
            </div>
            <span className="text-cyan-400/80 text-[10px] sm:text-xs">{profile.xp} / {nextLevelXp} XP</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: "spring", bounce: 0, duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 px-4 py-2 bg-slate-950/50 rounded-xl border border-slate-800/50">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Wins</span>
          <span className="text-cyan-400 font-mono text-sm">{profile.wins}</span>
        </div>
        <div className="w-px h-6 bg-slate-800" />
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Losses</span>
          <span className="text-rose-400 font-mono text-sm">{profile.losses}</span>
        </div>
        <div className="w-px h-6 bg-slate-800" />
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Draws</span>
          <span className="text-slate-400 font-mono text-sm">{profile.draws}</span>
        </div>
      </div>
    </div>
  );
}
