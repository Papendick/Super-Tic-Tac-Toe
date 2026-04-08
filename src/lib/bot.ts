import { GameState, Player, checkWinner, checkGameWinner, SectorState } from './gameLogic';

export type Difficulty = 'easy' | 'medium' | 'hard';

export function getValidMoves(state: GameState) {
  const moves: { sIdx: number, cIdx: number }[] = [];
  for (let s = 0; s < 9; s++) {
    if (state.activeSector !== null && state.activeSector !== s) continue;
    if (state.board[s].winner !== null) continue;
    for (let c = 0; c < 9; c++) {
      if (state.board[s].cells[c] === null) {
        moves.push({ sIdx: s, cIdx: c });
      }
    }
  }
  return moves;
}

export function getBotMove(state: GameState, difficulty: Difficulty): { sIdx: number, cIdx: number } | null {
  const moves = getValidMoves(state);
  if (moves.length === 0) return null;

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const botPlayer = state.currentPlayer;
  const humanPlayer = botPlayer === 'X' ? 'O' : 'X';

  // Hilfsfunktion: Kann ein Spieler einen bestimmten Sektor im nächsten Zug gewinnen?
  const canWinSector = (sector: SectorState, player: Player): number | null => {
    if (sector.winner) return null;
    for (let i = 0; i < 9; i++) {
      if (sector.cells[i] === null) {
        const newCells = [...sector.cells];
        newCells[i] = player;
        if (checkWinner(newCells) === player) return i;
      }
    }
    return null;
  };

  if (difficulty === 'medium') {
    // 1. Versuche den aktuellen Sektor zu gewinnen
    for (const move of moves) {
      const newCells = [...state.board[move.sIdx].cells];
      newCells[move.cIdx] = botPlayer;
      if (checkWinner(newCells) === botPlayer) return move;
    }
    // 2. Versuche den Gegner im aktuellen Sektor zu blockieren
    for (const move of moves) {
      const newCells = [...state.board[move.sIdx].cells];
      newCells[move.cIdx] = humanPlayer;
      if (checkWinner(newCells) === humanPlayer) return move;
    }
    // 3. Ansonsten zufällig
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (difficulty === 'hard') {
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      let score = 0;
      const sIdx = move.sIdx;
      const cIdx = move.cIdx;

      // Zug simulieren
      const newBoard = state.board.map(s => ({ cells: [...s.cells], winner: s.winner }));
      newBoard[sIdx].cells[cIdx] = botPlayer;
      newBoard[sIdx].winner = checkWinner(newBoard[sIdx].cells);
      
      const gameWinner = checkGameWinner(newBoard);
      if (gameWinner === botPlayer) return move; // Sofortiger Sieg!

      if (newBoard[sIdx].winner === botPlayer) score += 100; // Sektor gewonnen
      
      // Gegner im Sektor blockiert?
      const oppCells = [...state.board[sIdx].cells];
      oppCells[cIdx] = humanPlayer;
      if (checkWinner(oppCells) === humanPlayer) score += 50;

      // Strategische Positionen im Sektor bevorzugen
      if (cIdx === 4) score += 5; // Mitte
      else if ([0, 2, 6, 8].includes(cIdx)) score += 2; // Ecken

      // Das Wichtigste: Wohin schicken wir den Gegner?
      const nextSector = cIdx;
      if (newBoard[nextSector].winner !== null) {
        // SCHLECHT: Wir geben dem Gegner einen Freien Zug!
        score -= 200;
      } else {
        // Kann der Gegner den Ziel-Sektor gewinnen?
        if (canWinSector(newBoard[nextSector], humanPlayer) !== null) {
          score -= 100;
        }
      }

      // Leichter Zufallsfaktor, damit der Bot nicht immer exakt gleich spielt
      score += Math.random();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  return moves[0];
}
