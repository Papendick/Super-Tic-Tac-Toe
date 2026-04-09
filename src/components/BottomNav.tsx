import React from 'react';
import { Gamepad2, Target, Shield, User } from 'lucide-react';
import { useQuantumStore, TabId } from '../lib/store';
import { motion } from 'motion/react';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'play', label: 'Command', icon: Gamepad2 },
  { id: 'directives', label: 'Directives', icon: Target },
  { id: 'armory', label: 'Armory', icon: Shield },
  { id: 'dossier', label: 'Dossier', icon: User },
];

export function BottomNav() {
  const { currentTab, setCurrentTab, tutorialStep, profile, dailyChallenges } = useQuantumStore();
  const isTutorialActive = !profile.tutorialCompleted && tutorialStep > 0;

  const hasClaimableChallenges = dailyChallenges.some(c => c.isCompleted && !c.isClaimed);

  if (isTutorialActive) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 flex items-center justify-around px-2 sm:px-6 z-40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {TABS.map(tab => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;
        const showNotification = tab.id === 'directives' && hasClaimableChallenges;
        
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`relative flex flex-col items-center justify-center w-20 h-full gap-1.5 transition-colors duration-300 ${
              isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute top-0 w-10 h-1 bg-cyan-400 rounded-b-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            
            <div className="relative">
              <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''}`} />
              {showNotification && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse" />
              )}
            </div>
            
            <span className="text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
