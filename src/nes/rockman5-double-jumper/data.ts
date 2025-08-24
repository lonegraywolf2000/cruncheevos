import { Condition } from '@cruncheevos/core';

export const address = {
  currentArea: 0x29,
  weaponBar: 0x2e,
  bossBar: 0x2f,
  animationId: 0x30,
  equippedWeapon: 0x32,
  bulletsOut: 0x34,
  dashModeTemporary: 0x51,
  energyBalancer: 0x61,
  energyExchanger: 0x62,
  healEnhancer: 0x63,
  knockbackGuard: 0x64,
  dashModePermanent: 0x66,
  currentStage: 0x6c,
  canDoubleJump: 0xa3,
  playerHealth: 0xb0, // used as a base for the weapons.
  energyTanks: 0xbd,
  lifeCount: 0xbf,
  musicId: 0xd9, // may not need this as much.
  backgroundBanks: 0xea,
};

export const stageLookup = {
  0: 'Gravity Man',
  1: 'Wave Man',
  2: 'Stone Man',
  3: 'Gyro Man',
  4: 'Star Man',
  5: 'Charge Man',
  6: 'Napalm Man',
  7: 'Crystal Man',
  8: 'Proto Castle 1',
  9: 'Proto Castle 2',
  10: 'Proto Castle 3',
  11: 'Proto Castle 4',
  12: 'Wily Castle 1',
  13: 'Wily Castle 2',
  14: 'Wily Castle 3',
  15: 'Wily Castle 4',
};

/**
 * What's the name of the boss at the end of the stage?
 */
export const bossLookup = {
  0: 'Gravity Man',
  1: 'Wave Man',
  2: 'Stone Man',
  3: 'Gyro Man',
  4: 'Star Man',
  5: 'Charge Man',
  6: 'Napalm Man',
  7: 'Crystal Man',
  8: 'Dark Man 1',
  9: 'Dark Man 2',
  10: 'Dark Man 3',
  11: 'Dark Man 4',
  12: 'Big Pets',
  13: 'Circring Q9',
  14: 'Wily Press',
  15: 'Wily Machine 5',
};

type SpecialItem = [string, string, number, number];

export const specialItemScreenLookup: Record<number, SpecialItem> = {
  0: ['Jet Propulsion', 'the Rush Jet', 0x7, 0xbb],
  1: ['Precision Waves', 'the Super Arrow', 0x3, 0xb5],
  2: ['Beaten Down Gravel', 'Beat', 0x3, 0xbc],
  3: ['Gyroscopic Exchange', 'the Energy Exchanger', 0xc, 0x62],
  4: ['Astrological Balance', 'the Energy Balancer', 0x3, 0x61],
  5: ['Charged Coil', 'the Rush Coil', 0x5, 0xba],
  6: ['Incendiary Health', 'the Heal Enhancer', 0x3, 0x63],
  7: ['Crystalized Guard', 'the Knockback Guard', 0x4, 0x64],
};

export const bossScreenLookup = {
  1: 10,
};

type RobotMaster = {
  area: number;
  weaponTitle: string;
  clearBit: Condition.Size;
};
export const robotMasterLookup: Record<number, RobotMaster> = {
  0: { area: 0x0f, weaponTitle: 'Taking Hold', clearBit: 'Bit0' },
  1: { area: 0x10, weaponTitle: 'Making Waves', clearBit: 'Bit1' },
  2: { area: 0x10, weaponTitle: 'Spiraling Power', clearBit: 'Bit2' },
  3: { area: 0x10, weaponTitle: 'Throwing Attack', clearBit: 'Bit3' },
  4: { area: 0x0d, weaponTitle: 'Stargazing Crash', clearBit: 'Bit4' },
  5: { area: 0x0e, weaponTitle: 'Sliding Kick', clearBit: 'Bit5' },
  6: { area: 0x0b, weaponTitle: 'Exploding Bomb', clearBit: 'Bit6' },
  7: { area: 0x0f, weaponTitle: 'Blinding Eye', clearBit: 'Bit7' },
};

type Guardian = {
  area: number;
  stageTitle: string;
};

export const majorGuardianLookup: Record<number, Guardian> = {
  8: { area: 0x0a, stageTitle: 'Hopping Mad' },
  9: { area: 0x0b, stageTitle: 'When Push Comes To Shove' },
  10: { area: 0x0c, stageTitle: 'Sticky Situation' },
  11: { area: 0x04, stageTitle: 'The Original Chimera Bot' }, // no graceful
  12: { area: 0x0d, stageTitle: 'Slicing Tower of Pets-a' }, // No double jump cheevo on boss
  13: { area: 0x0d, stageTitle: 'Squaring The Circring' }, // No double jump cheevo on boss
  14: { area: 0x02, stageTitle: 'Pressing For More Details' }, // No double jump cheevo towards boss
  15: { area: 0x05, stageTitle: 'Rockman Dealing Justice' },
};
