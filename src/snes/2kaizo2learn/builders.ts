import { define as $, andNext, orNext } from '@cruncheevos/core';

import { simpleCmpTwoConstants, simpleCurrCompare, simplePrevCompare } from '../../common/builders.js';

import { address } from './data.js';

const introRoom = simpleCurrCompare('24bit', 0xce, 0x9cdf82);

export const startFullGameDeathless = () => $(simpleCurrCompare('8bit', address.exitCount, 0), introRoom);

export const titleScreen = () => $().orNext(introRoom, simpleCurrCompare('8bit', address.gameMode, 10, '<='));
export const inOverworld = () =>
  $(simpleCurrCompare('8bit', address.gameMode, 11, '>='), simpleCurrCompare('8bit', address.gameMode, 15, '<='));

export const outOfLevel = () =>
  $(simpleCurrCompare('8bit', address.gameMode, 14, '<='), simplePrevCompare('8bit', address.gameMode, 14, '<='));
export const inLevel = () => simpleCurrCompare('8bit', address.levelId, 0, '!=');
export const activeInLevel = () => simpleCurrCompare('8bit', address.gameMode, 0x14);
export const activeRoom = (room: number) => simpleCurrCompare('16bit', address.activeRoom, room);

export const deathAnimation = () => simpleCurrCompare('8bit', address.animationState, 9);

export const marioDied = () =>
  andNext(['', 'Delta', '8bit', address.animationState, '!=', 'Value', '', 9], deathAnimation());

export const levelBeaten = (levelId: number) => simpleCurrCompare('Bit7', address.levelCompleteBase + levelId, 1);

export const noCheckpoint = () =>
  $(
    ['AddAddress', 'Mem', '8bit', address.levelId],
    ['', 'Mem', 'Bit6', address.levelCompleteBase, '=', 'Value', '', 0],
  );

export const activeLevel = (level: number) => simpleCurrCompare('8bit', address.levelId, level);

export const loadLevel = (level: number) =>
  $(activeLevel(level), noCheckpoint(), simpleCmpTwoConstants('8bit', address.gameMode, 17, 18));

export const beatLevel = () =>
  $(
    simpleCurrCompare('8bit', address.animationState, 9, '!='),
    simplePrevCompare('8bit', address.animationState, 9, '!='),
    simpleCurrCompare('8bit', address.animationState, 6, '!='),
    simplePrevCompare('8bit', address.animationState, 6, '!='),
    simpleCurrCompare('8bit', address.exitMode, 1, '>='),
    simpleCurrCompare('8bit', address.exitMode, 4, '<='),
    simplePrevCompare('8bit', address.gameMode, 0x14, '>='),
    simpleCurrCompare('8bit', address.gameMode, 0x0b),
  );

export const moonCollected = (tile: number) =>
  $(simplePrevCompare('8bit', tile, 0x6e, '='), simpleCurrCompare('8bit', tile, 0x25));

export const keyJumpChallenge = () =>
  simpleCurrCompare('8bit', 0xcac8, 0x1a).trigger(
    orNext(
      simpleCurrCompare('8bit', 0xca0b, 0x48),
      simpleCurrCompare('8bit', 0xca1b, 0x48),
      simpleCurrCompare('8bit', 0xca2b, 0x48),
    ),
  );

export const kaizoChallenge = () =>
  $().orNext(simpleCurrCompare('8bit', 0xce44, 0x32), simpleCurrCompare('8bit', 0xce45, 0x32));

export const deathChallenge = () => $(simpleCurrCompare('16bit', 0x94, 2570, '>='), marioDied());
