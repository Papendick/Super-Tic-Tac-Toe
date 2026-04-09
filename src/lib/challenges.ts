export type ChallengeType = 
  | 'play_matches' 
  | 'win_matches' 
  | 'draw_matches'
  | 'win_pve' 
  | 'win_pvp' 
  | 'win_pve_medium'
  | 'win_pve_hard'
  | 'capture_center'
  | 'capture_any_sector'
  | 'flawless_win'; // Win without losing a single sector

export type ChallengeCategory = 'daily' | 'mastery' | 'secret';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  targetValue: number;
  currentValue: number;
  rewardXP: number;
  isCompleted: boolean;
  isClaimed: boolean;
  category: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
}

export const DAILY_CHALLENGES_POOL: Omit<Challenge, 'id' | 'currentValue' | 'isCompleted' | 'isClaimed' | 'category'>[] = [
  { title: 'Warming Up', description: 'Play 3 matches in any mode.', type: 'play_matches', targetValue: 3, rewardXP: 100 },
  { title: 'Tactical Superiority', description: 'Win 2 matches.', type: 'win_matches', targetValue: 2, rewardXP: 150 },
  { title: 'Machine Hunter', description: 'Win 1 match against the AI (PvE).', type: 'win_pve', targetValue: 1, rewardXP: 100 },
  { title: 'Gladiator', description: 'Win 1 match against another player (PvP).', type: 'win_pvp', targetValue: 1, rewardXP: 100 },
  { title: 'Center Control', description: 'Capture the center sector in a match.', type: 'capture_center', targetValue: 1, rewardXP: 50 },
  { title: 'Sector Specialist', description: 'Capture 5 sectors across any matches.', type: 'capture_any_sector', targetValue: 5, rewardXP: 120 },
];

export const MASTERY_CHALLENGES_POOL: Omit<Challenge, 'currentValue' | 'isCompleted' | 'isClaimed' | 'category'>[] = [
  // Easy
  { id: 'm_play_10', title: 'Initiate', description: 'Play 10 matches.', type: 'play_matches', targetValue: 10, rewardXP: 500, difficulty: 'easy' },
  { id: 'm_win_5', title: 'First Blood', description: 'Win 5 matches.', type: 'win_matches', targetValue: 5, rewardXP: 500, difficulty: 'easy' },
  // Medium
  { id: 'm_win_25', title: 'Adept Tactician', description: 'Win 25 matches.', type: 'win_matches', targetValue: 25, rewardXP: 1500, difficulty: 'medium' },
  { id: 'm_cap_50', title: 'Territory Control', description: 'Capture 50 sectors.', type: 'capture_any_sector', targetValue: 50, rewardXP: 1500, difficulty: 'medium' },
  { id: 'm_med_ai_10', title: 'Algorithm Breaker', description: 'Beat the Medium AI 10 times.', type: 'win_pve_medium', targetValue: 10, rewardXP: 2000, difficulty: 'medium' },
  // Hard
  { id: 'm_win_100', title: 'Grandmaster', description: 'Win 100 matches.', type: 'win_matches', targetValue: 100, rewardXP: 5000, difficulty: 'hard' },
  { id: 'm_hard_ai_25', title: 'Ghost in the Machine', description: 'Beat the Hard AI 25 times.', type: 'win_pve_hard', targetValue: 25, rewardXP: 5000, difficulty: 'hard' },
  // Impossible
  { id: 'm_hard_ai_100', title: 'Singularity', description: 'Beat the Hard AI 100 times.', type: 'win_pve_hard', targetValue: 100, rewardXP: 25000, difficulty: 'impossible' },
];

export const SECRET_CHALLENGES_POOL: Omit<Challenge, 'currentValue' | 'isCompleted' | 'isClaimed' | 'category'>[] = [
  { id: 's_pacifist', title: 'The Pacifist', description: 'Draw 3 matches.', type: 'draw_matches', targetValue: 3, rewardXP: 3000 },
  { id: 's_david', title: 'David vs Goliath', description: 'Beat the Hard AI for the first time.', type: 'win_pve_hard', targetValue: 1, rewardXP: 5000 },
  { id: 's_flawless', title: 'Absolute Dominance', description: 'Win a match without losing a single sector.', type: 'flawless_win', targetValue: 1, rewardXP: 10000 },
  { id: 's_center', title: 'Center of the Universe', description: 'Capture the center sector 10 times.', type: 'capture_center', targetValue: 10, rewardXP: 4000 },
];

export function generateDailyChallenges(): Challenge[] {
  const shuffled = [...DAILY_CHALLENGES_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((c, i) => ({
    ...c,
    id: `daily_${Date.now()}_${i}`,
    currentValue: 0,
    isCompleted: false,
    isClaimed: false,
    category: 'daily'
  }));
}

export function initializeMasteryChallenges(): Challenge[] {
  return MASTERY_CHALLENGES_POOL.map(c => ({ ...c, currentValue: 0, isCompleted: false, isClaimed: false, category: 'mastery' }));
}

export function initializeSecretChallenges(): Challenge[] {
  return SECRET_CHALLENGES_POOL.map(c => ({ ...c, currentValue: 0, isCompleted: false, isClaimed: false, category: 'secret' }));
}
