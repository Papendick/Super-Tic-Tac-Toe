import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, getInitialState, checkWinner, checkGameWinner, Player } from './gameLogic';
import { Difficulty } from './bot';
import { Challenge, ChallengeType, generateDailyChallenges, initializeMasteryChallenges, initializeSecretChallenges } from './challenges';
import { playSFX, vibrate } from './audio';
import { getSkinById } from './cosmetics';
import { gameEvents } from './events';

export interface PlayerProfile {
  level: number;
  xp: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  tutorialCompleted: boolean;
}

interface GameStateSlice {
  gameState: GameState;
  history: GameState[];
  gameMode: 'pvp' | 'pve';
  difficulty: Difficulty;
  tutorialStep: number;
}

export type TabId = 'play' | 'directives' | 'armory' | 'dossier';

export interface QuantumStore extends GameStateSlice {
  profile: PlayerProfile;
  
  // Tab State
  currentTab: TabId;
  setCurrentTab: (tab: TabId) => void;
  
  // Challenge State
  dailyChallenges: Challenge[];
  masteryChallenges: Challenge[];
  secretChallenges: Challenge[];
  lastChallengeReset: string;
  checkDailyReset: () => void;
  progressChallenge: (type: ChallengeType, amount: number) => void;
  claimChallenge: (id: string, category: 'daily' | 'mastery' | 'secret') => void;
  
  // Cosmetics State
  equippedSkinX: string;
  equippedSkinO: string;
  equipSkin: (type: 'X' | 'O', skinId: string) => void;
  
  // Actions
  setGameMode: (mode: 'pvp' | 'pve') => void;
  setDifficulty: (diff: Difficulty) => void;
  makeMove: (sIdx: number, cIdx: number) => void;
  undo: () => void;
  resetGame: () => void;
  recordMatchEnd: (winner: Player | 'Draw' | null) => { xpGained: number; leveledUp: boolean; oldLevel: number; newLevel: number };
  
  // Tutorial Actions
  startTutorial: () => void;
  skipTutorial: () => void;
  advanceTutorial: () => void;
  completeTutorial: () => void;
}

// --- Progression Math ---
// Level 1: 0 XP
// Level 2: 100 XP
// Level 3: 400 XP
// Level 4: 900 XP
export const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;
export const getXpForNextLevel = (level: number) => Math.pow(level, 2) * 100;
export const getXpForCurrentLevel = (level: number) => Math.pow(level - 1, 2) * 100;

export const calculateMatchXP = (
  winner: Player | 'Draw' | null, 
  mode: 'pvp' | 'pve', 
  difficulty: Difficulty
) => {
  if (!winner) return 0;
  
  let xp = 0;
  
  // Base XP (Assuming Player is always 'X' for profile tracking purposes)
  if (winner === 'X') xp += 50; 
  else if (winner === 'Draw') xp += 20;
  else xp += 10; // Loss still gives participation XP

  // Difficulty Bonus (only applied if the player wins or draws in PvE)
  if (mode === 'pve' && (winner === 'X' || winner === 'Draw')) {
    if (difficulty === 'medium') xp += 20;
    if (difficulty === 'hard') xp += 50;
  }

  return xp;
};

export const useQuantumStore = create<QuantumStore>()(
  persist(
    (set, get) => ({
      // Initial State
      gameState: getInitialState(),
      history: [],
      gameMode: 'pve', // Default to PvE for better FTUE
      difficulty: 'easy', // Start easy for new players
      tutorialStep: 0,
      currentTab: 'play',

      profile: {
        level: 1,
        xp: 0,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        tutorialCompleted: false,
      },

      // Challenge State
      dailyChallenges: [],
      masteryChallenges: [],
      secretChallenges: [],
      lastChallengeReset: '',

      // Cosmetics State
      equippedSkinX: 'x_default',
      equippedSkinO: 'o_default',

      equipSkin: (type, skinId) => {
        set((state) => {
          const skin = getSkinById(skinId);
          if (!skin || skin.type !== type || state.profile.level < skin.requiredLevel) return {};
          
          playSFX('claim'); // Reusing claim sound for equipping
          vibrate(50);
          
          if (type === 'X') return { equippedSkinX: skinId };
          return { equippedSkinO: skinId };
        });
      },

      checkDailyReset: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        
        const updates: Partial<QuantumStore> = {};
        
        if (state.lastChallengeReset !== today) {
          updates.dailyChallenges = generateDailyChallenges();
          updates.lastChallengeReset = today;
        }

        // Initialize mastery and secret challenges if they don't exist (migration)
        if (!state.masteryChallenges || state.masteryChallenges.length === 0) {
          updates.masteryChallenges = initializeMasteryChallenges();
        }
        if (!state.secretChallenges || state.secretChallenges.length === 0) {
          updates.secretChallenges = initializeSecretChallenges();
        }

        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },

      progressChallenge: (type, amount) => {
        set((state) => {
          let updated = false;
          
          const updateList = (list: Challenge[]) => {
            return list.map(c => {
              if (c.type === type && !c.isCompleted) {
                updated = true;
                const newValue = Math.min(c.currentValue + amount, c.targetValue);
                return { ...c, currentValue: newValue, isCompleted: newValue >= c.targetValue };
              }
              return c;
            });
          };

          const newDaily = updateList(state.dailyChallenges || []);
          const newMastery = updateList(state.masteryChallenges || []);
          const newSecret = updateList(state.secretChallenges || []);

          return updated ? { 
            dailyChallenges: newDaily,
            masteryChallenges: newMastery,
            secretChallenges: newSecret
          } : {};
        });
      },

      claimChallenge: (id, category) => {
        set((state) => {
          let listKey: 'dailyChallenges' | 'masteryChallenges' | 'secretChallenges' = 'dailyChallenges';
          if (category === 'mastery') listKey = 'masteryChallenges';
          if (category === 'secret') listKey = 'secretChallenges';

          const list = state[listKey] || [];
          const challenge = list.find(c => c.id === id);
          
          if (challenge && challenge.isCompleted && !challenge.isClaimed) {
            const newXp = state.profile.xp + challenge.rewardXP;
            const newLevel = calculateLevel(newXp);
            
            playSFX('claim');
            vibrate([50, 50, 100]);

            return {
              [listKey]: list.map(c => c.id === id ? { ...c, isClaimed: true } : c),
              profile: {
                ...state.profile,
                xp: newXp,
                level: newLevel
              }
            };
          }
          return {};
        });
      },

      // Actions
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setGameMode: (mode) => set({ gameMode: mode }),
      setDifficulty: (diff) => set({ difficulty: diff }),

      startTutorial: () => set({ tutorialStep: 1, gameState: getInitialState(), history: [], gameMode: 'pve', difficulty: 'easy' }),
      skipTutorial: () => set((state) => ({ profile: { ...state.profile, tutorialCompleted: true }, tutorialStep: 0 })),
      advanceTutorial: () => set((state) => ({ tutorialStep: state.tutorialStep + 1 })),
      completeTutorial: () => set((state) => ({ profile: { ...state.profile, tutorialCompleted: true }, tutorialStep: 0 })),

      makeMove: (sIdx, cIdx) => {
        const { gameState, history } = get();
        const { board, currentPlayer, activeSector, gameWinner } = gameState;

        if (gameWinner) return;
        if (activeSector !== null && activeSector !== sIdx) return;
        if (board[sIdx].winner) return;
        if (board[sIdx].cells[cIdx]) return;

        const newBoard = board.map(sector => ({
          ...sector,
          cells: [...sector.cells]
        }));

        const wasCenterWon = board[4].winner !== null;
        const oldSectorWinner = board[sIdx].winner;

        newBoard[sIdx].cells[cIdx] = currentPlayer;
        newBoard[sIdx].winner = checkWinner(newBoard[sIdx].cells);

        const isCenterWonNow = newBoard[4].winner !== null;
        const newSectorWinner = newBoard[sIdx].winner;

        const newGameWinner = checkGameWinner(newBoard);

        let nextActiveSector: number | null = cIdx;
        if (newBoard[nextActiveSector].winner !== null) {
          nextActiveSector = null; // Free move
        }

        // Audio & Haptics
        if (newGameWinner) {
          playSFX('gameWin');
          vibrate([100, 50, 100, 50, 200]);
        } else if (!oldSectorWinner && newSectorWinner) {
          playSFX('sectorWin');
          vibrate([50, 50, 50]);
        } else {
          playSFX(currentPlayer === 'X' ? 'moveX' : 'moveO');
          vibrate(15);
        }

        set({
          history: [...history, gameState],
          gameState: {
            board: newBoard,
            currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
            activeSector: nextActiveSector,
            gameWinner: newGameWinner
          }
        });

        // Emit Events for Challenge Tracking
        if (!oldSectorWinner && newSectorWinner) {
          gameEvents.emit('SECTOR_CAPTURED', {
            player: newSectorWinner,
            sectorIndex: sIdx
          });
        }

        // Tutorial Progression
        if (!get().profile.tutorialCompleted && get().tutorialStep > 0) {
          const currentStep = get().tutorialStep;
          if (currentStep === 1 && currentPlayer === 'X') get().advanceTutorial();
          else if (currentStep === 2 && currentPlayer === 'O') get().advanceTutorial();
          else if (currentStep === 3 && currentPlayer === 'X') get().advanceTutorial();
        }
      },

      undo: () => {
        const { history, gameMode, gameState } = get();
        if (history.length === 0 || gameState.gameWinner) return;

        // In PvE, undoing a move should revert both the bot's move and the player's move
        if (gameMode === 'pve') {
          if (history.length >= 2) {
            set({
              gameState: history[history.length - 2],
              history: history.slice(0, -2)
            });
          }
        } else {
          set({
            gameState: history[history.length - 1],
            history: history.slice(0, -1)
          });
        }
      },

      resetGame: () => set({ gameState: getInitialState(), history: [] }),

      recordMatchEnd: (winner) => {
        const { profile, gameMode, difficulty, gameState } = get();
        
        const isWin = winner === 'X';
        const isLoss = winner === 'O';
        const isDraw = winner === 'Draw';

        const xpGained = calculateMatchXP(winner, gameMode, difficulty);
        const newXp = profile.xp + xpGained;
        const oldLevel = profile.level;
        const newLevel = calculateLevel(newXp);
        const leveledUp = newLevel > oldLevel;

        set({
          profile: {
            ...profile,
            xp: newXp,
            level: newLevel,
            matchesPlayed: profile.matchesPlayed + 1,
            wins: profile.wins + (isWin ? 1 : 0),
            losses: profile.losses + (isLoss ? 1 : 0),
            draws: profile.draws + (isDraw ? 1 : 0),
          }
        });

        // Emit Event for Challenge Tracking
        const lostSectors = gameState.board.filter(s => s.winner === 'O').length;
        gameEvents.emit('MATCH_END', {
          winner,
          mode: gameMode,
          difficulty,
          flawless: isWin && lostSectors === 0
        });

        return { xpGained, leveledUp, oldLevel, newLevel };
      }
    }),
    {
      name: 'quantum-grid-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || !version) {
          // Defensive check for invalid/null persisted state
          const safeState = (persistedState && typeof persistedState === 'object') ? persistedState : {};
          
          // Migration from unversioned state to v1
          return {
            ...safeState,
            dailyChallenges: safeState.dailyChallenges || [],
            masteryChallenges: safeState.masteryChallenges || [],
            secretChallenges: safeState.secretChallenges || [],
            equippedSkinX: safeState.equippedSkinX || 'x_default',
            equippedSkinO: safeState.equippedSkinO || 'o_default',
          };
        }
        return persistedState;
      },
      // Persist the entire store so matches can be resumed and profile is saved
      partialize: (state) => ({ 
        profile: state.profile,
        gameState: state.gameState,
        history: state.history,
        gameMode: state.gameMode,
        difficulty: state.difficulty,
        tutorialStep: state.tutorialStep,
        dailyChallenges: state.dailyChallenges,
        masteryChallenges: state.masteryChallenges,
        secretChallenges: state.secretChallenges,
        lastChallengeReset: state.lastChallengeReset,
        equippedSkinX: state.equippedSkinX,
        equippedSkinO: state.equippedSkinO
      }), 
    }
  )
);
