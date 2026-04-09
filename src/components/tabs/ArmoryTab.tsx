import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';
import { useQuantumStore } from '../../lib/store';
import { motion } from 'motion/react';
import { X_SKINS, O_SKINS, Skin } from '../../lib/cosmetics';
import { IconX, IconO } from '../GameIcons';

export function ArmoryTab() {
  const { profile, equippedSkinX, equippedSkinO, equipSkin } = useQuantumStore();
  const [activeTab, setActiveTab] = useState<'X' | 'O'>('X');

  const skins = activeTab === 'X' ? X_SKINS : O_SKINS;
  const equippedId = activeTab === 'X' ? equippedSkinX : equippedSkinO;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center z-10 mb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter uppercase drop-shadow-lg">
          Armory
        </h2>
        <p className="text-cyan-400/80 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mt-2">
          Tactical Customization
        </p>
      </div>

      {/* Toggle X / O */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/50 shadow-inner mb-8">
        <button
          onClick={() => setActiveTab('X')}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            activeTab === 'X' 
              ? 'bg-slate-800 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/30' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <IconX className="w-4 h-4" strokeWidth={12} /> Protocol X
        </button>
        <button
          onClick={() => setActiveTab('O')}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            activeTab === 'O' 
              ? 'bg-slate-800 text-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.2)] border border-rose-500/30' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <IconO className="w-4 h-4" strokeWidth={12} /> Protocol O
        </button>
      </div>

      {/* Skins Grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skins.map((skin, index) => {
          const isUnlocked = profile.level >= skin.requiredLevel;
          const isEquipped = equippedId === skin.id;

          return (
            <motion.div
              key={skin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => isUnlocked && !isEquipped && equipSkin(activeTab, skin.id)}
              className={`relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center text-center
                ${!isUnlocked ? 'opacity-50 grayscale border-slate-800 cursor-not-allowed' : ''}
                ${isUnlocked && !isEquipped ? 'border-slate-700/50 hover:border-slate-500 cursor-pointer hover:bg-slate-800/60' : ''}
                ${isEquipped ? 'border-amber-500/50 shadow-[0_0_30px_rgba(251,191,36,0.15)] bg-slate-800/80' : ''}
              `}
            >
              {/* Preview Icon */}
              <div className={`w-24 h-24 mb-6 rounded-2xl flex items-center justify-center bg-slate-950/80 border border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]
                ${isUnlocked ? skin.colorClass : 'text-slate-600'}
                ${isUnlocked ? skin.glowClass : ''}
              `}>
                {activeTab === 'X' ? (
                  <IconX className="w-12 h-12" strokeWidth={skin.strokeWidth} />
                ) : (
                  <IconO className="w-12 h-12" strokeWidth={skin.strokeWidth} />
                )}
              </div>

              {/* Info */}
              <h3 className={`font-bold text-lg tracking-wide mb-1 ${isEquipped ? 'text-amber-400' : 'text-slate-200'}`}>
                {skin.name}
              </h3>
              <p className="text-slate-400 text-xs mb-6 h-8">{skin.description}</p>

              {/* Status/Action */}
              <div className="mt-auto w-full">
                {!isUnlocked ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-slate-950/50 rounded-xl border border-slate-800 text-slate-500 font-bold uppercase tracking-widest text-xs">
                    <Lock className="w-4 h-4" />
                    Unlocks at Lvl {skin.requiredLevel}
                  </div>
                ) : isEquipped ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400 font-bold uppercase tracking-widest text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Equipped
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 font-bold uppercase tracking-widest text-xs transition-colors hover:bg-slate-700">
                    Equip
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
