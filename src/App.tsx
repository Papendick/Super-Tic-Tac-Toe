/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RotateCcw, Undo2, User, Bot, Sparkles, Trophy, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, getInitialState, checkWinner, checkGameWinner } from './lib/gameLogic';
import { getBotMove, Difficulty } from './lib/bot';
import { IconX, IconO, IconDraw } from './components/GameIcons';

// --- Theme Constants ---
const THEME = {
  x: {
    color: 'text-cyan-400',
    glow: 'drop-shadow-[0_0_16px_rgba(34,211,238,0.9)]',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/40',
  },
  o: {
    color: 'text-rose-400',
    glow: 'drop-shadow-[0_0_16px_rgba(251,113,133,0.9)]',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/40',
  },
  activeSector: 'ring-2 ring-amber-400/80 shadow-[0_0_40px_rgba(251,191,36,0.2),inset_0_0_20px_rgba(251,191,36,0.1)] bg-slate-800/90 scale-[1.03] z-10 border-amber-500/60',
  inactiveSector: 'opacity-30 bg-slate-900/60 scale-[0.97] z-0 border-slate-800/30 grayscale-[50%]',
  neutralSector: 'bg-slate-800/50 scale-100 z-0 border-slate-700/40 hover:bg-slate-800/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]',
  freeMovePulse: 'animate-pulse ring-2 ring-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.15)] bg-slate-800/70',
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [history, setHistory] = useState<GameState[]>([]);
  const [gameMode, setGameMode] = useState<'pvp' | 'pve'>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isBotThinking, setIsBotThinking] = useState(false);

  const { board, currentPlayer, activeSector, gameWinner } = gameState;

  const handleCellClick = (sIdx: number, cIdx: number, isBotMove = false) => {
    if (gameWinner) return;
    if (activeSector !== null && activeSector !== sIdx) return;
    if (board[sIdx].winner) return;
    if (board[sIdx].cells[cIdx]) return;
    if (gameMode === 'pve' && currentPlayer === 'O' && !isBotMove) return;

    setHistory(prev => [...prev, gameState]);

    const newBoard = board.map(sector => ({
      ...sector,
      cells: [...sector.cells]
    }));

    newBoard[sIdx].cells[cIdx] = currentPlayer;
    newBoard[sIdx].winner = checkWinner(newBoard[sIdx].cells);

    const newGameWinner = checkGameWinner(newBoard);

    let nextActiveSector: number | null = cIdx;
    if (newBoard[nextActiveSector].winner !== null) {
      nextActiveSector = null; // Free move
    }

    setGameState({
      board: newBoard,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      activeSector: nextActiveSector,
      gameWinner: newGameWinner
    });
  };

  // Bot Turn Effect
  useEffect(() => {
    if (gameMode === 'pve' && gameState.currentPlayer === 'O' && !gameState.gameWinner) {
      setIsBotThinking(true);
      const timer = setTimeout(() => {
        const move = getBotMove(gameState, difficulty);
        if (move) {
          handleCellClick(move.sIdx, move.cIdx, true);
        }
        setIsBotThinking(false);
      }, 700); // Cinematic delay
      return () => clearTimeout(timer);
    }
  }, [gameState, gameMode, difficulty]);

  const handleUndo = () => {
    if (history.length === 0 || gameWinner || isBotThinking) return;
    
    if (gameMode === 'pve') {
      if (history.length >= 2) {
        setGameState(history[history.length - 2]);
        setHistory(prev => prev.slice(0, -2));
      }
    } else {
      const previousState = history[history.length - 1];
      setGameState(previousState);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const resetGame = () => {
    setGameState(getInitialState());
    setHistory([]);
    setIsBotThinking(false);
  };

  const isFreeMove = activeSector === null && history.length > 0 && !gameWinner;

  return (
    <div className="min-h-screen bg-[#0a0f16] text-slate-200 flex flex-col items-center py-6 px-4 sm:px-6 font-sans relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- Cinematic Background --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-900/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-rose-900/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0f16_100%)] pointer-events-none" />

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
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                gameMode === 'pvp' 
                  ? 'bg-slate-800 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/30' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <User className="w-4 h-4" /> PvP <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setGameMode('pve'); resetGame(); }}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                gameMode === 'pve' 
                  ? 'bg-slate-800 text-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.2)] border border-rose-500/30' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
              }`}
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
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      difficulty === diff 
                        ? 'bg-slate-800 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] border border-amber-500/30' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
                    }`}
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
                    <span className={`font-black text-xl flex items-center gap-3 ${currentPlayer === 'X' ? THEME.x.color : THEME.o.color} ${currentPlayer === 'X' ? THEME.x.glow : THEME.o.glow}`}>
                      {currentPlayer === 'X' ? <IconX className="w-6 h-6" strokeWidth={14} /> : <IconO className="w-6 h-6" strokeWidth={14} />}
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
          
          let sectorStyle = THEME.neutralSector;
          if (isSectorActive) sectorStyle = isFreeMove ? THEME.freeMovePulse : THEME.activeSector;
          else if (isSectorInactive || sector.winner || gameWinner) sectorStyle = THEME.inactiveSector;

          return (
            <div 
              key={sIdx} 
              className={`relative grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-2xl transition-all duration-500 border ${sectorStyle}`}
            >
              {sector.cells.map((cell, cIdx) => {
                const isValidMove = isSectorActive && !cell && !(gameMode === 'pve' && currentPlayer === 'O');
                
                return (
                  <button
                    key={cIdx}
                    onClick={() => handleCellClick(sIdx, cIdx)}
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
                          className={`w-4/5 h-4/5 flex items-center justify-center ${cell === 'X' ? THEME.x.color : THEME.o.color} ${cell === 'X' ? THEME.x.glow : THEME.o.glow}`}
                        >
                          {cell === 'X' ? <IconX strokeWidth={12} /> : <IconO strokeWidth={12} />}
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
                        ${sector.winner === 'X' ? THEME.x.color : sector.winner === 'O' ? THEME.o.color : 'text-slate-400'}
                        ${sector.winner === 'X' ? THEME.x.glow : sector.winner === 'O' ? THEME.o.glow : ''}
                      `}
                    >
                      {sector.winner === 'X' && <IconX strokeWidth={14} />}
                      {sector.winner === 'O' && <IconO strokeWidth={14} />}
                      {sector.winner === 'Draw' && <IconDraw strokeWidth={14} />}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
          disabled={history.length === 0 || !!gameWinner || isBotThinking}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900/80 disabled:cursor-not-allowed text-slate-300 font-bold uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 border border-slate-700/50 hover:border-slate-500 shadow-lg backdrop-blur-md"
        >
          <Undo2 className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Undo Move
        </button>
        <button 
          onClick={resetGame}
          className="group flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md"
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
                    ${gameWinner === 'X' ? THEME.x.color : gameWinner === 'O' ? THEME.o.color : 'text-slate-400'}
                    ${gameWinner === 'X' ? THEME.x.glow : gameWinner === 'O' ? THEME.o.glow : ''}
                  `}
                >
                  {gameWinner === 'X' && <IconX className="w-20 h-20" strokeWidth={12} />}
                  {gameWinner === 'O' && <IconO className="w-20 h-20" strokeWidth={12} />}
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
                <p className="text-slate-400 mb-12 text-lg font-medium tracking-wide">
                  {gameWinner === 'Draw' 
                    ? 'Tactical deadlock detected. No victor.' 
                    : 'Absolute tactical dominance achieved.'}
                </p>
                
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
