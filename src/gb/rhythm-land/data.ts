import { Achievement } from '@cruncheevos/core';
import { Points } from '../../common/types.js';

export const screenLookup = {
  0: 'Skater Dude',
  1: 'Pancake',
  2: 'Battleship',
  3: 'Seagull Serenade',
  5: 'Jukebox',
  6: 'Title Screen',
  7: 'Game Selection Screen',
} as const;

export const gradeLookup = {
  0: 'Bad',
  1: 'OK',
  2: 'Great',
  3: 'Perfect',
} as const;

export const address = {
  gameState: 0xc0da,
  gradeReveal: 0xc21d,
  earnedGrade: 0xff80,
  hitsPerfect: 0xff9e,
  hitsOk: 0xff9d,
  screenId: 0xffcf,
};

type CheevoData = {
  title: string;
  type?: Achievement.Type;
  points: Points;
  suffix: string;
  game: keyof typeof screenLookup;
  grade: keyof typeof gradeLookup;
};

export const cheevoData: CheevoData[] = [
  {
    title: 'Rodney Mullen',
    type: 'progression',
    points: 3,
    suffix: 'an OK or better',
    game: 0,
    grade: 1,
  },
  {
    title: 'Leticia Bufoni',
    points: 3,
    suffix: 'a Great or better',
    game: 0,
    grade: 2,
  },
  {
    title: 'Tony Hawk',
    points: 5,
    suffix: 'a Perfect',
    game: 0,
    grade: 3,
  },
  {
    title: 'Waffle House',
    type: 'progression',
    points: 3,
    suffix: 'an OK or better',
    game: 1,
    grade: 1,
  },
  {
    title: 'IHOP',
    points: 3,
    suffix: 'a Great or better',
    game: 1,
    grade: 2,
  },
  {
    title: 'OY!',
    points: 5,
    suffix: 'a Perfect',
    game: 1,
    grade: 3,
  },
  {
    title: 'Port Arthur',
    type: 'progression',
    points: 3,
    suffix: 'an OK or better',
    game: 2,
    grade: 1,
  },
  {
    title: 'Jutland',
    points: 3,
    suffix: 'a Great or better',
    game: 2,
    grade: 2,
  },
  {
    title: 'Surigao Strait',
    points: 5,
    suffix: 'a Perfect',
    game: 2,
    grade: 3,
  },
  {
    title: 'Angry Birds',
    type: 'progression',
    points: 4,
    suffix: 'an OK or better',
    game: 3,
    grade: 1,
  },
  {
    title: 'Goodfeathers',
    points: 5,
    suffix: 'a Great or better',
    game: 3,
    grade: 2,
  },
  {
    title: 'The Kantonian Fried Chick--err, Legendary Birds',
    points: 10,
    suffix: 'a Perfect',
    game: 3,
    grade: 3,
  },
];
