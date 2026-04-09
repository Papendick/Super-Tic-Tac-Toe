import React from 'react';
import { User, Trophy, Target, Swords, Activity, Hash, Percent, Skull } from 'lucide-react';
import { useQuantumStore } from '../../lib/store';
import { motion } from 'motion/react';

export function DossierTab() {
  const profile = useQuantumStore(state => state.profile);

  const winRate = profile.matchesPlayed > 0 
    ? Math.round((profile.wins / profile.matchesPlayed) * 100) 
    : 0;

  const stats = [
    { label: 'Matches', value: profile.matchesPlayed, icon: Hash, color: 'text-slate-400' },
    { label: 'Victories', value: profile.wins, icon: Trophy, color: 'text-amber-400' },
    { label: 'Defeats', value: profile.losses, icon: Skull, color: 'text-rose-400' },
    { label: 'Stalemates', value: profile.draws, icon: Swords, color: 'text-slate-500' },
  ];

  return (
    <div className="w-full max-w-4xl flex flex-col items-center z-10 mb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter uppercase drop-shadow-lg">
          Dossier
        </h2>
        <p className="text-cyan-400/80 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mt-2">
          Service Record
        </p>
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Win Rate Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-8"
        >
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-slate-200 uppercase tracking-widest">Combat Efficiency</h3>
            </div>
            <p className="text-slate-400 text-sm">Overall tactical success rate across all engagements.</p>
          </div>

          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
              <motion.circle 
                cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * winRate) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{winRate}</span>
              <Percent className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        </motion.div>

        {/* Stat Grid */}
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-lg flex items-center gap-6"
            >
              <div className={`p-4 rounded-2xl bg-slate-950/50 border border-slate-800 ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-200">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}
