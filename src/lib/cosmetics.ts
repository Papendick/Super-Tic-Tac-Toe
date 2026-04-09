export type SkinType = 'X' | 'O';

export interface Skin {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  type: SkinType;
  colorClass: string;
  glowClass: string;
  strokeWidth: number;
}

export const X_SKINS: Skin[] = [
  {
    id: 'x_default',
    name: 'Standard Issue',
    description: 'The default tactical X marker.',
    requiredLevel: 1,
    type: 'X',
    colorClass: 'text-cyan-400',
    glowClass: 'drop-shadow-[0_0_16px_rgba(34,211,238,0.9)]',
    strokeWidth: 12,
  },
  {
    id: 'x_neon',
    name: 'Neon Strike',
    description: 'High-visibility neon green marker.',
    requiredLevel: 3,
    type: 'X',
    colorClass: 'text-emerald-400',
    glowClass: 'drop-shadow-[0_0_20px_rgba(52,211,153,1)]',
    strokeWidth: 14,
  },
  {
    id: 'x_void',
    name: 'Void Walker',
    description: 'Dark matter infused marker.',
    requiredLevel: 7,
    type: 'X',
    colorClass: 'text-purple-500',
    glowClass: 'drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]',
    strokeWidth: 16,
  },
  {
    id: 'x_solar',
    name: 'Solar Flare',
    description: 'Blindingly bright yellow marker.',
    requiredLevel: 12,
    type: 'X',
    colorClass: 'text-yellow-400',
    glowClass: 'drop-shadow-[0_0_30px_rgba(250,204,21,1)]',
    strokeWidth: 10,
  },
  {
    id: 'x_glitch',
    name: 'System Error',
    description: 'A corrupted marker from the mainframe.',
    requiredLevel: 20,
    type: 'X',
    colorClass: 'text-fuchsia-500',
    glowClass: 'drop-shadow-[0_0_15px_rgba(217,70,239,1)]',
    strokeWidth: 8,
  }
];

export const O_SKINS: Skin[] = [
  {
    id: 'o_default',
    name: 'Standard Issue',
    description: 'The default tactical O marker.',
    requiredLevel: 1,
    type: 'O',
    colorClass: 'text-rose-400',
    glowClass: 'drop-shadow-[0_0_16px_rgba(251,113,133,0.9)]',
    strokeWidth: 12,
  },
  {
    id: 'o_ocean',
    name: 'Deep Ocean',
    description: 'High-pressure blue marker.',
    requiredLevel: 3,
    type: 'O',
    colorClass: 'text-blue-500',
    glowClass: 'drop-shadow-[0_0_20px_rgba(59,130,246,1)]',
    strokeWidth: 14,
  },
  {
    id: 'o_magma',
    name: 'Magma Core',
    description: 'Superheated orange marker.',
    requiredLevel: 7,
    type: 'O',
    colorClass: 'text-orange-500',
    glowClass: 'drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]',
    strokeWidth: 16,
  },
  {
    id: 'o_ghost',
    name: 'Phantom',
    description: 'Ethereal white marker.',
    requiredLevel: 12,
    type: 'O',
    colorClass: 'text-slate-200',
    glowClass: 'drop-shadow-[0_0_30px_rgba(226,232,240,1)]',
    strokeWidth: 10,
  },
  {
    id: 'o_toxic',
    name: 'Biohazard',
    description: 'Corrosive lime green marker.',
    requiredLevel: 20,
    type: 'O',
    colorClass: 'text-lime-400',
    glowClass: 'drop-shadow-[0_0_15px_rgba(163,230,53,1)]',
    strokeWidth: 8,
  }
];

export const getAllSkins = () => [...X_SKINS, ...O_SKINS];

export const getSkinById = (id: string): Skin | undefined => {
  return getAllSkins().find(s => s.id === id);
};
