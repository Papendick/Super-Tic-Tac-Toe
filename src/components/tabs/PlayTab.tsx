import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Undo2, User, Bot, Sparkles, Trophy, Cpu, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getBotMove, Difficulty } from '../../lib/bot';
import { IconX, IconO, IconDraw } from '../GameIcons';
import { useQuantumStore } from '../../lib/store';
import { getSkinById } from '../../lib/cosmetics';
import { MacroSector } from '../game/MacroSector';

// --- Theme Constants ---
const THEME = {
  activeSector: 'ring-2 ring-amber-400/80 shadow-[0_0_40px_rgba(251,191,36,0.2),inset_0_0_20px_rgba(251,191,36,0.1)] bg-slate-800/90 scale-[1.03] z-10 border-amber-500/60',
  inactiveSector: 'opacity-30 bg-slate-900/60 scale-[0.97] z-0 border-slate-800/30 grayscale-[50%]',
  neutralSector: 'bg-slate-800/50 scale-100 z-0 border-slate-700/40 hover:bg-slate-800/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]',
  freeMovePulse: 'animate-pulse ring-2 ring-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.15)] bg-slate-800/70',
};

export function PlayTab() {
  const { 
    gameState, history, gameMode, difficulty, profile, tutorialStep,
    equippedSkinX, equippedSkinO,
    setGameMode, setDifficulty, undo, resetGame, recordMatchEnd 
  } = useQuantumStore();

  const [isBotThinking, setIsBotThinking] = useState(false);
  const [matchResult, setMatchResult] = useState<{ xpGained: number; leveledUp: boolean; oldLevel: number; newLevel: number } | null>(null);

  const { board, currentPlayer, activeSector, gameWinner } = gameState;
  const isTutorialActive = !profile.tutorialCompleted && tutorialStep > 0;

  const skinX = getSkinById(equippedSkinX) || getSkinById('x_default')!;
  const skinO = getSkinById(equippedSkinO) || getSkinById('o_default')!;

  const isProcessingRef = useRef(false);

  const handleCellClick = useCallback((sIdx: number, cIdx: number, isBotMove = false) => {
    if (isProcessingRef.current) return;
    
    // Get fresh state directly from store to avoid closure staleness 
    // and keep the function reference 100% stable for React.memo
    const state = useQuantumStore.getState();
    const currentGameState = state.gameState;
    
    if (currentGameState.gameWinner) return;
    if (currentGameState.activeSector !== null && currentGameState.activeSector !== sIdx) return;
    if (currentGameState.board[sIdx].winner) return;
    if (currentGameState.board[sIdx].cells[cIdx]) return;
    if (state.gameMode === 'pve' && currentGameState.currentPlayer === 'O' && !isBotMove) return;

    isProcessingRef.current = true;
    state.makeMove(sIdx, cIdx);
    
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 50);
  }, []);

  // Bot Turn Effect
  useEffect(() => {
    let isActive = true; // Closure flag for unmount/reset safety

    if (gameMode === 'pve' && gameState.currentPlayer === 'O' && !gameState.gameWinner) {
      setIsBotThinking(true);
      const timer = setTimeout(() => {
        if (!isActive) return; // Abort if state is obsolete
        
        const move = getBotMove(gameState, difficulty);
        if (move && isActive) {
          handleCellClick(move.sIdx, move.cIdx, true);
        }
        if (isActive) setIsBotThinking(false);
      }, 700); // Cinematic delay
      
      return () => {
        isActive = false;
        clearTimeout(timer);
      };
    }
  }, [gameState, gameMode, difficulty]);

  // Match End Effect
  useEffect(() => {
    if (gameState.gameWinner && !matchResult) {
      const result = recordMatchEnd(gameState.gameWinner);
      setMatchResult(result);
    } else if (!gameState.gameWinner && matchResult) {
      setMatchResult(null);
    }
  }, [gameState.gameWinner, matchResult, recordMatchEnd]);

  const handleUndo = () => {
    if (history.length === 0 || gameWinner || isBotThinking || isTutorialActive) return;
    undo();
  };

  const isFreeMove = activeSector === null && history.length > 0 && !gameWinner;

  return (
    <div className="w-full flex flex-col items-center pb-24">
      {/* --- Header / HUD --- */}
      <div className="w-full max-w-4xl flex flex-col items-center z-10 mb-6 sm:mb-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter mb-2 drop-shadow-lg uppercase">
            Super Tic-Tac-Toe
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <p className="text-cyan-400/80 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
              Tactical Grid Protocol
            </p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-rose-500/50" />
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-2 rounded-2xl border border-slate-700/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          {/* Mode Toggle */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => { setGameMode('pvp'); resetGame(); }}
              disabled={isTutorialActive}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                gameMode === 'pvp' 
                  ? 'bg-slate-800 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/30' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
              } ${isTutorialActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <User className="w-4 h-4" /> PvP <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setGameMode('pve'); resetGame(); }}
              disabled={isTutorialActive}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                gameMode === 'pve' 
                  ? 'bg-slate-800 text-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.2)] border border-rose-500/30' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
              } ${isTutorialActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <User className="w-4 h-4" /> PvE <Bot className="w-4 h-4" />
            </button>
          </div>

          {/* Difficulty (PvE only) */}
          <AnimatePresence mode="popLayout">
            {gameMode === 'pve' && (
              <motion.div 
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 shadow-inner overflow-hidden"
              >
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    disabled={isTutorialActive}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      difficulty === diff 
                        ? 'bg-slate-800 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] border border-amber-500/30' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
                    } ${isTutorialActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {diff === 'easy' ? 'Lvl 1' : diff === 'medium' ? 'Lvl 2' : 'Lvl 3'}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- Status Bar --- */}
      <div className="w-full max-w-4xl flex justify-center items-center h-16 mb-8 z-10">
        <AnimatePresence mode="wait">
          {!gameWinner ? (
            <motion.div 
              key="status"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-4"
            >
              {isBotThinking ? (
                <div className="flex items-center gap-4 px-8 py-3 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-rose-500/30 shadow-[0_0_30px_rgba(251,113,133,0.15)]">
                  <Cpu className="w-6 h-6 text-rose-400 animate-pulse" />
                  <span className="text-rose-200 font-mono text-sm tracking-widest uppercase">System berechnet...</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-4 px-8 py-3 bg-slate-900/90 backdrop-blur-xl rounded-2xl border shadow-2xl transition-all duration-500 ${currentPlayer === 'X' ? 'border-cyan-500/40 shadow-cyan-900/30' : 'border-rose-500/40 shadow-rose-900/30'}`}>
                    <span className="text-slate-400 font-mono text-xs tracking-widest uppercase">Active Protocol</span>
                    <div className="w-px h-6 bg-slate-700" />
                    <span className={`font-black text-xl flex items-center gap-3 ${currentPlayer === 'X' ? skinX.colorClass : skinO.colorClass} ${currentPlayer === 'X' ? skinX.glowClass : skinO.glowClass}`}>
                      {currentPlayer === 'X' ? <IconX className="w-6 h-6" strokeWidth={skinX.strokeWidth} /> : <IconO className="w-6 h-6" strokeWidth={skinO.strokeWidth} />}
                      PLAYER {currentPlayer}
                    </span>
                  </div>
                  
                  {isFreeMove && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      className="flex items-center gap-2 px-6 py-3 bg-amber-500/15 border border-amber-500/50 text-amber-400 rounded-2xl font-bold shadow-[0_0_20px_rgba(251,191,36,0.25)] backdrop-blur-md"
                    >
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      <span className="tracking-wider uppercase text-sm">Freier Zug</span>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="gameover" className="h-16" />
          )}
        </AnimatePresence>
      </div>

      {/* --- Main Board --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        style={{ perspective: "1000px" }}
        className="relative z-10 bg-slate-900/30 p-4 sm:p-6 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(255,255,255,0.02)] border border-slate-700/40 backdrop-blur-2xl w-full max-w-[450px] sm:max-w-[700px] aspect-square grid grid-cols-3 gap-3 sm:gap-5"
      >
        {/* Tactical Grid Lines (Background) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {board.map((sector, sIdx) => {
          const isSectorActive = !gameWinner && (activeSector === null || activeSector === sIdx) && !sector.winner;
          const isSectorInactive = !gameWinner && activeSector !== null && activeSector !== sIdx && !sector.winner;
          
          return (
            <MacroSector
              key={sIdx}
              sector={sector}
              sIdx={sIdx}
              isActive={isSectorActive}
              isInactive={isSectorInactive}
              isFreeMove={isFreeMove}
              gameWinner={gameWinner}
              gameMode={gameMode}
              currentPlayer={currentPlayer}
              isBotThinking={isBotThinking}
              skinX={skinX}
              skinO={skinO}
              onCellClick={handleCellClick}
            />
          );
        })}
      </motion.div>

      {/* --- Bottom Controls --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mt-12 flex gap-4 sm:gap-6 z-10"
      >
        <button 
          onClick={handleUndo}
          disabled={history.length === 0 || !!gameWinner || isBotThinking || isTutorialActive}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900/80 disabled:cursor-not-allowed text-slate-300 font-bold uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 border border-slate-700/50 hover:border-slate-500 shadow-lg backdrop-blur-md"
        >
          <Undo2 className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Undo Move
        </button>
        <button 
          onClick={resetGame}
          disabled={isTutorialActive}
          className={`group flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md ${isTutorialActive ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-700 ease-in-out" />
          Reset Protocol
        </button>
      </motion.div>

      {/* --- Endgame Modal --- */}
      <AnimatePresence>
        {gameWinner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f16]/90 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0, rotateX: -20 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, y: 40, opacity: 0, rotateX: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              style={{ perspective: "1000px" }}
              className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-8 sm:p-12 max-w-lg w-full shadow-[0_0_100px_rgba(0,0,0,1),inset_0_0_40px_rgba(255,255,255,0.05)] text-center relative overflow-hidden backdrop-blur-2xl"
            >
              {/* Modal Background Glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-48 blur-[80px] opacity-30 pointer-events-none
                ${gameWinner === 'X' ? 'bg-cyan-500' : gameWinner === 'O' ? 'bg-rose-500' : 'bg-slate-500'}
              `} />

              <div className="mb-10 flex justify-center relative z-10">
                <motion.div 
                  initial={{ scale: 0, rotate: -180, filter: "blur(10px)" }}
                  animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
                  transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
                  className={`w-32 h-32 rounded-3xl flex items-center justify-center bg-slate-950/80 border border-slate-800 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]
                    ${gameWinner === 'X' ? skinX.colorClass : gameWinner === 'O' ? skinO.colorClass : 'text-slate-400'}
                    ${gameWinner === 'X' ? skinX.glowClass : gameWinner === 'O' ? skinO.glowClass : ''}
                  `}
                >
                  {gameWinner === 'X' && <IconX className="w-20 h-20" strokeWidth={skinX.strokeWidth} />}
                  {gameWinner === 'O' && <IconO className="w-20 h-20" strokeWidth={skinO.strokeWidth} />}
                  {gameWinner === 'Draw' && <IconDraw className="w-20 h-20" strokeWidth={12} />}
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative z-10"
              >
                <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white tracking-tighter flex items-center justify-center gap-4 uppercase">
                  {gameWinner !== 'Draw' && <Trophy className={`w-10 h-10 ${gameWinner === 'X' ? 'text-cyan-400' : 'text-rose-400'} drop-shadow-lg`} />}
                  {gameWinner === 'Draw' ? 'Stalemate' : `Player ${gameWinner} Wins`}
                </h2>
                <p className="text-slate-400 mb-6 text-lg font-medium tracking-wide">
                  {gameWinner === 'Draw' 
                    ? 'Tactical deadlock detected. No victor.' 
                    : 'Absolute tactical dominance achieved.'}
                </p>

                {matchResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="mb-10 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col items-center gap-2"
                  >
                    <div className="text-cyan-400 font-mono text-xl font-bold">+{matchResult.xpGained} XP</div>
                    {matchResult.leveledUp && (
                      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-sm animate-pulse">
                        <ArrowUpCircle className="w-5 h-5" />
                        Level Up: {matchResult.newLevel}
                      </div>
                    )}
                  </motion.div>
                )}
                
                <button 
                  onClick={resetGame}
                  className="group w-full py-5 bg-white hover:bg-slate-200 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all duration-300 text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-4 border border-white/20"
                >
                  <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-700 ease-in-out" />
                  Initialize New Match
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
