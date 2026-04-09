import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconX, IconO, IconDraw } from '../GameIcons';
import { Skin } from '../../lib/cosmetics';
import { Player } from '../../lib/gameLogic';

interface SectorData {
  cells: (Player | null)[];
  winner: Player | 'Draw' | null;
}

interface MacroSectorProps {
  sector: SectorData;
  sIdx: number;
  isActive: boolean;
  isInactive: boolean;
  isFreeMove: boolean;
  gameWinner: string | null;
  gameMode: 'pvp' | 'pve';
  currentPlayer: 'X' | 'O';
  isBotThinking: boolean;
  skinX: Skin;
  skinO: Skin;
  onCellClick: (sIdx: number, cIdx: number, isBotMove?: boolean) => void;
}

const THEME = {
  activeSector: 'ring-2 ring-amber-400/80 shadow-[0_0_40px_rgba(251,191,36,0.2),inset_0_0_20px_rgba(251,191,36,0.1)] bg-slate-800/90 scale-[1.03] z-10 border-amber-500/60',
  inactiveSector: 'opacity-30 bg-slate-900/60 scale-[0.97] z-0 border-slate-800/30 grayscale-[50%]',
  neutralSector: 'bg-slate-800/50 scale-100 z-0 border-slate-700/40 hover:bg-slate-800/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]',
  freeMovePulse: 'animate-pulse ring-2 ring-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.15)] bg-slate-800/70',
};

export const MacroSector = memo(({
  sector, sIdx, isActive, isInactive, isFreeMove, gameWinner,
  gameMode, currentPlayer, isBotThinking, skinX, skinO, onCellClick
}: MacroSectorProps) => {
  let sectorStyle = THEME.neutralSector;
  if (isActive) sectorStyle = isFreeMove ? THEME.freeMovePulse : THEME.activeSector;
  else if (isInactive || sector.winner || gameWinner) sectorStyle = THEME.inactiveSector;

  return (
    <div className={`relative grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-2xl transition-all duration-500 border ${sectorStyle}`}>
      {sector.cells.map((cell, cIdx) => {
        const isValidMove = isActive && !cell && !(gameMode === 'pve' && currentPlayer === 'O');
        
        return (
          <button
            key={cIdx}
            onClick={() => onCellClick(sIdx, cIdx)}
            disabled={!isValidMove}
            className={`aspect-square w-full h-full rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden
              ${cell ? 'bg-slate-950/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]' : 'bg-slate-950/30 shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]'}
              ${isValidMove ? 'hover:bg-slate-700/60 hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] cursor-pointer hover:scale-[1.05] z-10' : 'cursor-default'}
            `}
          >
            {/* Hover indicator for valid moves */}
            {isValidMove && !isBotThinking && (
              <div className={`absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-300 ${currentPlayer === 'X' ? 'bg-cyan-500' : 'bg-rose-500'}`} />
            )}

            <AnimatePresence>
              {cell && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 0, rotate: cell === 'X' ? -90 : 90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`w-4/5 h-4/5 flex items-center justify-center ${cell === 'X' ? skinX.colorClass : skinO.colorClass} ${cell === 'X' ? skinX.glowClass : skinO.glowClass}`}
                >
                  {cell === 'X' ? <IconX strokeWidth={skinX.strokeWidth} /> : <IconO strokeWidth={skinO.strokeWidth} />}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        );
      })}
      
      {/* Sector Winner Overlay */}
      <AnimatePresence>
        {sector.winner && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex items-center justify-center z-20 overflow-hidden border border-slate-700/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            {/* Subtle background glow for won sector */}
            <div className={`absolute inset-0 opacity-30 ${sector.winner === 'X' ? 'bg-cyan-600' : sector.winner === 'O' ? 'bg-rose-600' : 'bg-slate-600'}`} />
            
            <motion.div
              initial={{ scale: 0, rotate: sector.winner === 'X' ? 180 : -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              className={`w-3/4 h-3/4 flex items-center justify-center 
                ${sector.winner === 'X' ? skinX.colorClass : sector.winner === 'O' ? skinO.colorClass : 'text-slate-400'}
                ${sector.winner === 'X' ? skinX.glowClass : sector.winner === 'O' ? skinO.glowClass : ''}
              `}
            >
              {sector.winner === 'X' && <IconX strokeWidth={skinX.strokeWidth + 2} />}
              {sector.winner === 'O' && <IconO strokeWidth={skinO.strokeWidth + 2} />}
              {sector.winner === 'Draw' && <IconDraw strokeWidth={14} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
