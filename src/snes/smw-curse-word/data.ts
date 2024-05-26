export const address = {
  powerUpState: 0x19,
  animationState: 0x71,
  gameState: 0x100,
  musicId: 0xdda,
  levelBase: 0x1ea2,
  activeLevel: 0x13bf,
};

export const levelLookup = {
  1: 'once upon a time',
  2: "you're fired",
  3: "that's balls",
  4: 'stupid jerks',
  5: "cavemen's invention",
  6: 'temple of scrabble',
  9: "i'm just a bill",
  8: 'thicc water',
  12: 'everything ever',
  13: 'cweditz',
  0x2a: "yorshi's house",
};

type LevelData = Record<number, [string, number]>;

export const beatLevelData: LevelData = {
  1: ['It Always Starts This Way', 5],
  2: ['Hot Stuff', 5],
  3: ['Some People...', 5],
  4: ['Never Far Away From Them', 5],
  5: ['Objective: Invent Wheel', 10],
  6: ["Chuck Woolery's Home?", 10],
  9: ['On Capital Hill', 10],
  8: ['Better Than A Ball Pit?', 10],
  12: ['That Was Some Story Alright', 25],
};

export const levelSmallData: LevelData = {
  1: ['Small Beginnings', 5],
  2: ['Small Burnings', 5],
  3: ['Small Sports', 5],
  4: ['Small Idiots', 5],
  5: ['Small Histories', 10],
  6: ['Small Rocks', 10],
  9: ['Small Politicians', 10],
  8: ['Small Lakes', 10],
  12: ['Small Omniscience', 25],
};

export const levelDeathData: Record<number, [string, number, number]> = {
  1: ['Surviving The Start', 5, 3],
  2: ['Surviving The Fire', 5, 3],
  3: ['Surviving The Attitude', 5, 3],
  4: ['Surviving The Bullies', 5, 3],
  5: ['Surviving The Past', 10, 6],
  6: ['Surviving The Headaches', 10, 6],
  9: ['Surviving The Lobbyists', 10, 6],
  8: ['Surviving The Sharks', 10, 6],
  12: ['Surviving The Watchers', 25, 9],
};

/**
 * Which level IDs are relevant for cheevo purposes?
 */
export const cheevoLevels = [1, 2, 3, 4, 5, 6, 9, 8, 12];

export const smallCheevoLevels = cheevoLevels.filter((l) => l != 4 && l != 12);
