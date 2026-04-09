import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuantumStore } from '../lib/store';
import { GraduationCap, Target, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export function TutorialOverlay() {
  const { profile, tutorialStep, startTutorial, skipTutorial, completeTutorial } = useQuantumStore();

  if (profile.tutorialCompleted) return null;

  return (
    <AnimatePresence>
      {tutorialStep === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f16]/90 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-cyan-500/20 blur-[60px] pointer-events-none" />
            <GraduationCap className="w-16 h-16 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Tactical Briefing</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Welcome to Quantum Grid. The rules are simple, but the strategy is deep. Would you like a quick interactive tutorial to understand the core mechanics?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={startTutorial}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                Start Training
              </button>
              <button
                onClick={skipTutorial}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Skip Tutorial
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {tutorialStep > 0 && tutorialStep < 4 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[600px] z-50 pointer-events-none"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)] flex items-start gap-4">
            {tutorialStep === 1 && <Target className="w-8 h-8 text-cyan-400 shrink-0 animate-pulse" />}
            {tutorialStep === 2 && <AlertCircle className="w-8 h-8 text-rose-400 shrink-0 animate-pulse" />}
            {tutorialStep === 3 && <Target className="w-8 h-8 text-amber-400 shrink-0 animate-pulse" />}
            
            <div>
              <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2">
                Training Step {tutorialStep}/3
              </h3>
              <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
                {tutorialStep === 1 && "Place your first X anywhere. The specific cell you choose will force the opponent to play in the corresponding sector."}
                {tutorialStep === 2 && "Observe: Your move dictated the opponent's active sector. They are now calculating their response..."}
                {tutorialStep === 3 && "Your turn: The opponent's move now dictates YOUR active sector (highlighted in amber). Plan ahead to trap them!"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {tutorialStep === 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f16]/90 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900/80 border border-amber-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(251,191,36,0.2)] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-amber-500/20 blur-[60px] pointer-events-none" />
            <CheckCircle2 className="w-16 h-16 text-amber-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Training Complete</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Win 3 micro-cells in a row to capture a sector. Capture 3 sectors to win the game. Good luck, Commander.
            </p>
            <button
              onClick={completeTutorial}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2"
            >
              Acknowledge <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
