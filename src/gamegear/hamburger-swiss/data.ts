import { Achievement } from '@cruncheevos/core';
import { Points } from '../../common/types.js';

export const address = {
  firedWeapon: 0x010d,
  lives: 0x011b,
  levelScore: 0x011c,
  currentLevel: 0x011f,
  totalScoreHundreds: 0x0135,
  totalScoreTens: 0x0136,
  totalScoreOnes: 0x0137,
  gameState: 0x1d05,
};

export const levelLookup = {
  1: 'Volcano',
  2: 'Ocean',
  3: 'Mountains',
  4: 'Sky',
  5: 'Caves',
  6: 'Grasslands',
  7: 'City',
};

type ProgressionData = [number, string, Points, Achievement.Type];

export const progressionData: ProgressionData[] = [
  [1, 'Bernese Oberland', 3, 'progression'],
  [2, 'Lake Lugano', 4, 'progression'],
  [3, 'Monte Rosa', 5, 'progression'],
  [4, 'Schilthorn', 5, 'progression'],
  [5, 'Tamina Gorge', 5, 'progression'],
  [6, 'Nardus', 10, 'progression'],
  [7, 'Bern', 10, 'win_condition'],
];

type ChallengeData = [number, Points, number];

export const challengeData: ChallengeData[] = [
  [0, 4, 0xc485],
  [1, 4, 0x6134],
  [2, 5, 0x5e3c],
  [3, 5, 0x61e1],
  [4, 5, 0x6121],
  [5, 10, 0x79a7],
  [6, 10, 0x639f],
];
