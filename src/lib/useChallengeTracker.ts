import { useEffect } from 'react';
import { useQuantumStore } from './store';
import { gameEvents } from './events';

export function useChallengeTracker() {
  const progressChallenge = useQuantumStore(state => state.progressChallenge);

  useEffect(() => {
    const handleMatchEnd = (data: { winner: string | null, mode: string, difficulty: string, flawless: boolean }) => {
      // Always progress 'play_matches' for the human player
      progressChallenge('play_matches', 1);

      if (data.winner === 'X') {
        progressChallenge('win_matches', 1);
        
        if (data.mode === 'pve') {
          progressChallenge('win_pve', 1);
          if (data.difficulty === 'medium') progressChallenge('win_pve_medium', 1);
          if (data.difficulty === 'hard') progressChallenge('win_pve_hard', 1);
        }
        
        if (data.mode === 'pvp') {
          progressChallenge('win_pvp', 1);
        }

        if (data.flawless) {
          progressChallenge('flawless_win', 1);
        }
      } else if (data.winner === 'Draw') {
        progressChallenge('draw_matches', 1);
      }
    };

    const handleSectorCaptured = (data: { player: string, sectorIndex: number }) => {
      if (data.player === 'X') {
        progressChallenge('capture_any_sector', 1);
        if (data.sectorIndex === 4) {
          progressChallenge('capture_center', 1);
        }
      }
    };

    gameEvents.on('MATCH_END', handleMatchEnd);
    gameEvents.on('SECTOR_CAPTURED', handleSectorCaptured);

    return () => {
      gameEvents.off('MATCH_END', handleMatchEnd);
      gameEvents.off('SECTOR_CAPTURED', handleSectorCaptured);
    };
  }, [progressChallenge]);
}
