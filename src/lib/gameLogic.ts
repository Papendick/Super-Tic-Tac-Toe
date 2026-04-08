export type Player = 'X' | 'O';
export type SectorWinner = Player | 'Draw' | null;
export type GameWinner = Player | 'Draw' | null;

export interface SectorState {
  cells: (Player | null)[];
  winner: SectorWinner;
}

export interface GameState {
  board: SectorState[];
  currentPlayer: Player;
  activeSector: number | null;
  gameWinner: GameWinner;
}

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

export function checkWinner(cells: (Player | null)[]): SectorWinner {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a] as Player;
    }
  }
  if (cells.every(c => c !== null)) {
    return 'Draw';
  }
  return null;
}

export function checkGameWinner(board: SectorState[]): GameWinner {
  const winners = board.map(s => s.winner === 'Draw' ? null : s.winner);
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (winners[a] && winners[a] === winners[b] && winners[a] === winners[c]) {
      return winners[a];
    }
  }
  if (board.every(s => s.winner !== null)) {
    return 'Draw';
  }
  return null;
}

export function getInitialState(): GameState {
  return {
    board: Array(9).fill(null).map(() => ({
      cells: Array(9).fill(null),
      winner: null
    })),
    currentPlayer: 'X',
    activeSector: null,
    gameWinner: null
  };
}
