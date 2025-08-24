import { Points } from '../../common/types.js';

export const address = {
  level: 0x1d6d50,
  gameState: 0x1d6d52,
  saveSlot: 0x1d6d56,
  songOffset: 0x1d6da6,
  linkX: 0x1d6db0,
  linkY: 0x1d6dc4,
  screenId: 0x1d6e2b,
  input: 0x1d6e3a,
  npc01Id: 0x1d7090,
  musicId: 0x1d7349,
  bItem: 0x1d7396,
  quest2Check: 0x1d736d,
  deathCount: 0x1d7370,
  sword: 0x1d7397,
  bombs: 0x1d7398,
  arrow: 0x1d7399,
  bow: 0x1d739a,
  candle: 0x1d739b,
  recorder: 0x1d739c,
  potion: 0x1d739e,
  rod: 0x1d739f,
  raft: 0x1d73a0,
  book: 0x1d73a1,
  ring: 0x1d73a2,
  ladder: 0x1d73a3,
  magicKey: 0x1d73a4,
  bracelet: 0x1d73a5,
  letter: 0x1d73a6,
  compass: 0x1d73a7,
  map: 0x1d73a8,
  rupees: 0x1d73ad,
  keys: 0x1d73ae,
  hearts: 0x1d73af,
  wisdom: 0x1d73b1,
  power: 0x1d73b2,
  boomerang: 0x1d73b4,
  shield: 0x1d73b6,
  capacity: 0x1d73bc,
  overworldStart: 0x1d73bf,
  dungeonStart: 0x1d743f,
};

export const dungeonLookup = {
  1: 'Eagle',
  2: 'Crescent',
  3: 'Manji',
  4: 'Snake',
  5: 'Lizard',
  6: 'Dragon',
  7: 'Demon',
  8: 'Lion',
  9: 'Skull',
  11: 'Erosion',
  13: 'Aberration',
  12: 'Languish',
  15: 'Dementia',
  14: 'Zenith',
  16: 'Cowl',
  18: 'Spiral',
  17: 'Green Mile',
  19: 'Ganon',
  '*': 'Hyrule',
};

export const questAgnosticItemData: [string, Points, string, number][] = [
  ['Listen To Your Elders', 1, 'Do as the old man says and pick up the Wooden Sword in either quest', 0x77],
  ['Playing the Pronoun Game', 5, 'Gain the ability to pick up the White Sword in either quest', 0x0a],
  [`Now You're Playing With Power`, 5, `Pick up the abandoned Power Bracelet in either quest`, 0x24],
  // ['No Second For Calling?', 5, 'Pick up the prescription letter the Old Woman needs to sell you potions', 0x0e],
];

export const dungeonItemData: [string, string, number, number, number][] = [
  ['Throwing Rupees At the Problem', 'bow', 0, 1, 0x7f],
  ['The Natural Banana', 'wooden boomerang', 0, 1, 0x44],
  ['The Enchanted Banana', 'magical boomerang', 0, 2, 0x4f],
  ['Sailing Away My Friends', 'raft', 0, 3, 0x0f],
  ['The Great Debate of Japanifornia', '[step] ladder', 0, 4, 0x60],
  ['Needs Rewind And Fast Forward Buttons', 'recorder', 0, 5, 0x04],
  ['What Gemstone This Time?', 'magical rod', 0, 6, 0x75],
  ['Burninating The Forest', 'red candle', 0, 7, 0x4a],
  ['Ruby Powered Flames', 'book of magic', 0, 8, 0x6f],
  [`Mr. Qi's Gift`, 'magical key', 0, 8, 0x0f],
  ['Belated Armor', 'red ring', 0, 9, 0x00],
  [`Weakness Under The Wizzrobe Mat`, 'silver arrow', 0, 9, 0x4f],
  ['The Organic Banana', 'wooden boomerang', 1, 1, 0x78],
  ['The Secret Garden', 'recorder', 1, 3, 0x0b],
  ['The Mechanical Benana', 'magical boomerang', 1, 2, 0x15],
  ['Reading Rainbow', 'book of magic', 1, 5, 0x7f],
  ['Rude Area for Taking', 'raft', 1, 5, 0x6a],
  ['Still Lacking Quivers', 'bow', 1, 4, 0x7a],
  ['Eat Your Hamburgers Apollo', '[step] ladder', 1, 6, 0x46],
  [`Smokey's Disappointing Growl`, 'red candle', 1, 8, 0x70],
  ['Reversal of Acquisition', 'magical rod', 1, 7, 0x2b],
  ['Never Leave Home Without It', 'magical key', 1, 7, 0x2c],
  ['Hunting Preparations', 'silver arrow', 1, 9, 0x76],
  [`Where's The Bubble Ring?`, 'red ring', 1, 9, 0x77],
];

export const dungeonFinishData: [string, number, number, number][] = [
  ['The Eagle Has Landed', 0, 1, 0x36],
  ['Crescent Moon Power, Transform', 0, 2, 0x0d],
  ['Four Arms of Love', 0, 3, 0x3d],
  ['Thankfully Not Poisonous', 0, 4, 0x03],
  ['No Tongue Thing to Worry About', 0, 5, 0x14],
  ['Tongues Are The Least of Your Worries', 0, 6, 0x0c],
  ['Demeanor From the Demon', 0, 7, 0x2b],
  ['Hear Link (Silently) Roar', 0, 8, 0x2c],
  ['Another Trope Properly Handled', 0, 9, 0x32],
  [`Everyone's Suspicious of the Start`, 1, 1, 0x08],
  ['Angry at the Game Designers', 1, 3, 0x1b],
  ['Looking Confused at the Map', 1, 2, 0x20],
  ['Designing Dungeons 101 Course Required', 1, 5, 0x4f],
  ['Zealously Forging Ahead', 1, 4, 0x00],
  ['A Feather In His Cap', 1, 6, 0x16],
  ['Spiralling Out of Control', 1, 8, 0x1b],
  ['And I Would Walk 500 More', 1, 7, 0x2d],
  [`We've Got to Stop Meeting Like This`, 1, 9, 0x07],
];

// What screens have money secrets on the first quest?
export const moneySecret1: number[] = [
  0x0f, 0x13, 0x28, 0x2d, 0x3d, 0x48, 0x4e, 0x51, 0x56, 0x5b, 0x62, 0x67, 0x6b, 0x71,
];

export const moneySecret2: number[] = [
  0x13, 0x22, 0x28, 0x2b, 0x2d, 0x3d, 0x48, 0x4e, 0x51, 0x53, 0x56, 0x58, 0x5b, 0x6e,
];

export const candleData: [number, number][] = [
  [0, 0x0c],
  [0, 0x5e],
  [0, 0x66],
  [1, 0x0c],
  [1, 0x0e],
  [1, 0x15],
  [1, 0x5e],
  [1, 0x66],
  [1, 0x74],
];

export const blueRingShopData: [number, number][] = [
  [0, 0x34],
  [1, 0x0f],
];

export const arrowShopData: number[] = [0x25, 0x44, 0x4a, 0x6f];

export const doorRepair1Data: number[] = [0x01, 0x03, 0x07, 0x14, 0x1e, 0x63, 0x68, 0x6a, 0x7d];
export const doorRepair2Data: number[] = [0x01, 0x03, 0x07, 0x14, 0x1e, 0x63, 0x68, 0x6a, 0x72, 0x7d];

export const bombUp1Data: [number, number][] = [
  [5, 0x17],
  [7, 0x48],
];

export const bombUp2Data: [number, number][] = [
  [5, 0x4e],
  [7, 0x6b],
];

export const heartContainer1Data: [number, number][] = [
  [0, 0x2c],
  [0, 0x2f],
  [0, 0x47],
  [0, 0x6f],
  [0, 0x7b],
  [1, 0x35],
  [2, 0x0e],
  [3, 0x4d],
  [5, 0x13],
  [4, 0x24],
  [6, 0x1c],
  [8, 0x2a],
  [7, 0x3c],
];

export const heartContainer2Data: [number, number][] = [
  [0, 0x06],
  [0, 0x20],
  [0, 0x2f],
  [0, 0x3a],
  [0, 0x6f],
  [1, 0x07],
  [3, 0x2b],
  [2, 0x66],
  [5, 0x5f],
  [4, 0x26],
  [6, 0x1c],
  [8, 0x1c],
  [7, 0x3d],
];

export type DungeonScreenData = {
  level: number;
  screens: number[];
};

export const map1Data: DungeonScreenData[] = [
  { level: 1, screens: [0x43, 0x54] },
  { level: 2, screens: [0x5f, 0x6f] },
  { level: 3, screens: [0x4c, 0x5a] },
  { level: 4, screens: [0x21, 0x62] },
  { level: 5, screens: [0x37, 0x46] },
  { level: 6, screens: [0x19, 0x68] },
  { level: 7, screens: [0x18, 0x5a] },
  { level: 8, screens: [0x2e, 0x5f] },
  { level: 9, screens: [0x27, 0x35] },
];

export const map2Data: DungeonScreenData[] = [
  { level: 1, screens: [0x48, 0x57] },
  { level: 3, screens: [0x09, 0x5a] },
  { level: 2, screens: [0x45, 0x76] },
  { level: 5, screens: [0x41, 0x60] },
  { level: 4, screens: [0x1f, 0x6c] },
  { level: 6, screens: [0x34, 0x43] },
  { level: 8, screens: [0x1f, 0x39] },
  { level: 7, screens: [0x6e, 0x78] },
  { level: 9, screens: [0x42, 0x46] },
];

export const key1Data: DungeonScreenData[] = [
  { level: 1, screens: [0x23, 0x33, 0x45, 0x53, 0x72, 0x74] },
  { level: 2, screens: [0x3e, 0x4e, 0x6c, 0x7e] },
  { level: 3, screens: [0x2a, 0x49, 0x4b, 0x6b, 0x7b] },
  { level: 4, screens: [0x01, 0x40, 0x51, 0x70] },
  { level: 5, screens: [0x16, 0x26, 0x27, 0x47, 0x55, 0x66, 0x77] },
  { level: 6, screens: [0x1a, 0x29, 0x2d, 0x58, 0x7a] },
  { level: 7, screens: [0x0a, 0x3a, 0x6d, 0x78] },
  { level: 8, screens: [0x4b, 0x4c, 0x5c, 0x5d, 0x5e, 0x7f] },
  { level: 9, screens: [0x47, 0x56, 0x57, 0x58, 0x61] },
];

export const key2Data: DungeonScreenData[] = [
  { level: 1, screens: [0x18, 0x67] },
  { level: 3, screens: [0x19, 0x2a, 0x4a, 0x49, 0x5b, 0x69, 0x6b] },
  { level: 2, screens: [0x30, 0x35] },
  { level: 5, screens: [0x1d, 0x3d, 0x4c, 0x7c] },
  { level: 4, screens: [0x02, 0x31, 0x70] },
  { level: 6, screens: [0x14, 0x63] },
  { level: 8, screens: [0x09, 0x0a, 0x0f] },
  { level: 7, screens: [0x2a, 0x2e] },
  { level: 9, screens: [0x32] },
];
