import mitt from 'mitt';
import { Player } from './gameLogic';
import { Difficulty } from './bot';

export type GameEvents = {
  MATCH_END: {
    winner: Player | 'Draw' | null;
    mode: 'pvp' | 'pve';
    difficulty: Difficulty;
    flawless: boolean;
  };
  SECTOR_CAPTURED: {
    player: Player;
    sectorIndex: number;
  };
  MATCH_PLAYED: {
    mode: 'pvp' | 'pve';
  };
};

export const gameEvents = mitt<GameEvents>();
