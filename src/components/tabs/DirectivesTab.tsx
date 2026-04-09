import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Gift, ArrowUpCircle, Eye, Lock, Shield, Zap, Skull } from 'lucide-react';
import { useQuantumStore } from '../../lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge } from '../../lib/challenges';

export function DirectivesTab() {
  const { dailyChallenges, masteryChallenges, secretChallenges, claimChallenge } = useQuantumStore();
  const [activeSection, setActiveSection] = useState<'daily' | 'mastery'>('daily');
  const [showSecrets, setShowSecrets] = useState(false);

  const hasUnlockedSecret = secretChallenges?.some(c => c.isCompleted) || false;

  const renderChallengeList = (challenges: Challenge[], isSecret = false) => {
    if (!challenges || challenges.length === 0) {
      return (
        <div className="text-center p-12 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No directives available.</p>
        </div>
      );
    }

    return (
      <AnimatePresence mode="popLayout">
        {challenges.map((challenge, index) => {
          const progressPercent = Math.min(100, Math.max(0, (challenge.currentValue / challenge.targetValue) * 100));
          const isCompleted = challenge.isCompleted;
          const isClaimed = challenge.isClaimed;

          // Secret challenges hide their description until completed
          const displayDescription = (isSecret && !isCompleted) ? '???' : challenge.description;
          const displayTitle = challenge.title;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border shadow-lg transition-all duration-300 ${
                isClaimed 
                  ? 'border-slate-800/50 opacity-60 grayscale-[30%]' 
                  : isCompleted 
                    ? 'border-amber-500/50 shadow-[0_0_30px_rgba(251,191,36,0.15)]' 
                    : isSecret ? 'border-purple-500/30' : 'border-slate-700/50'
              }`}
            >
              {!isClaimed && (
                <div 
                  className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-out ${isSecret ? 'bg-purple-900/20' : 'bg-slate-800/30'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              )}

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`mt-1 flex-shrink-0 ${isCompleted ? 'text-amber-400' : isSecret ? 'text-purple-500' : 'text-slate-500'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isSecret ? <Eye className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-lg tracking-wide ${isCompleted && !isClaimed ? 'text-amber-400' : isSecret ? 'text-purple-300' : 'text-slate-200'}`}>
                        {displayTitle}
                      </h3>
                      {challenge.difficulty && (
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md border ${
                          challenge.difficulty === 'easy' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50' :
                          challenge.difficulty === 'medium' ? 'bg-blue-950/50 text-blue-400 border-blue-900/50' :
                          challenge.difficulty === 'hard' ? 'bg-rose-950/50 text-rose-400 border-rose-900/50' :
                          'bg-purple-950/50 text-purple-400 border-purple-900/50'
                        }`}>
                          {challenge.difficulty}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isSecret && !isCompleted ? 'text-purple-500/50 font-mono tracking-widest' : 'text-slate-400'}`}>
                      {displayDescription}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${isCompleted ? 'bg-amber-400' : isSecret ? 'bg-purple-500' : 'bg-cyan-500'}`}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {challenge.currentValue} / {challenge.targetValue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-800 sm:border-t-0">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-900/50">
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>{challenge.rewardXP} XP</span>
                  </div>
                  
                  {isCompleted && !isClaimed && (
                    <button
                      onClick={() => claimChallenge(challenge.id, challenge.category)}
                      className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105"
                    >
                      <Gift className="w-4 h-4" />
                      Claim
                    </button>
                  )}
                  {isClaimed && (
                    <div className="px-6 py-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                      Claimed
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center z-10 mb-24 relative">
      <div className="text-center mb-6 relative w-full">
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter uppercase drop-shadow-lg">
          Directives
        </h2>
        <p className="text-cyan-400/80 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mt-2">
          Tactical Objectives
        </p>

        {hasUnlockedSecret && (
          <button 
            onClick={() => setShowSecrets(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-purple-950/30 text-purple-400 rounded-full border border-purple-500/30 hover:bg-purple-900/50 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Toggle */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/50 shadow-inner mb-8">
        <button
          onClick={() => setActiveSection('daily')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            activeSection === 'daily' 
              ? 'bg-slate-800 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/30' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <Zap className="w-4 h-4" /> Daily
        </button>
        <button
          onClick={() => setActiveSection('mastery')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            activeSection === 'mastery' 
              ? 'bg-slate-800 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] border border-amber-500/30' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <Shield className="w-4 h-4" /> Mastery
        </button>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {activeSection === 'daily' && renderChallengeList(dailyChallenges)}
        {activeSection === 'mastery' && renderChallengeList(masteryChallenges)}
      </div>

      {/* Secret Challenges Modal */}
      <AnimatePresence>
        {showSecrets && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f16]/95 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto"
          >
            <div className="w-full max-w-2xl py-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-purple-400 tracking-tighter uppercase flex items-center gap-3">
                    <Skull className="w-8 h-8" /> Classified
                  </h2>
                  <p className="text-purple-500/60 text-xs font-bold tracking-[0.2em] uppercase mt-1">
                    Hidden Objectives
                  </p>
                </div>
                <button 
                  onClick={() => setShowSecrets(false)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold uppercase tracking-widest text-xs border border-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                {renderChallengeList(secretChallenges, true)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
