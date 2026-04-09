/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useQuantumStore } from './lib/store';
import { useChallengeTracker } from './lib/useChallengeTracker';
import { PlayerHeader } from './components/PlayerHeader';
import { TutorialOverlay } from './components/TutorialOverlay';
import { BottomNav } from './components/BottomNav';
import { PlayTab } from './components/tabs/PlayTab';
import { DirectivesTab } from './components/tabs/DirectivesTab';
import { ArmoryTab } from './components/tabs/ArmoryTab';
import { DossierTab } from './components/tabs/DossierTab';

export default function App() {
  const { currentTab, checkDailyReset } = useQuantumStore();

  // Initialize challenge tracking event listeners
  useChallengeTracker();

  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  return (
    <div className="min-h-screen bg-[#0a0f16] text-slate-200 flex flex-col items-center py-6 px-4 sm:px-6 font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      
      <TutorialOverlay />

      {/* --- Cinematic Background --- */}
      <div className="fixed top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-900/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-rose-900/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0f16_100%)] pointer-events-none" />

      <PlayerHeader />

      {/* --- Tab Content --- */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center z-10">
        {currentTab === 'play' && <PlayTab />}
        {currentTab === 'directives' && <DirectivesTab />}
        {currentTab === 'armory' && <ArmoryTab />}
        {currentTab === 'dossier' && <DossierTab />}
      </div>

      <BottomNav />
    </div>
  );
}
