import { define as $, andNext } from '@cruncheevos/core';

import * as commonBuilders from '../../common/builders.js';

import { address } from './data.js';

export const deathAnimation = () => commonBuilders.simpleCmpOneConstant('8bit', address.animationState, 9);

export const marioDied = () =>
  andNext(['', 'Delta', '8bit', address.animationState, '!=', 'Value', '', 9], deathAnimation());

export const deathCount = (times: number) =>
  andNext(
    ['', 'Delta', '8bit', address.animationState, '!=', 'Value', '', 9],
    ['', 'Mem', '8bit', address.animationState, '=', 'Value', '', 9, times],
  );

export const beatLevel = () =>
  $(
    ['', 'Mem', '8bit', address.animationState, '!=', 'Value', '', 9],
    ['', 'Delta', '8bit', address.animationState, '!=', 'Value', '', 9],
    ['', 'Mem', '8bit', address.animationState, '!=', 'Value', '', 6],
    ['', 'Delta', '8bit', address.animationState, '!=', 'Value', '', 6],
    ['', 'Mem', '8bit', address.musicId, '=', 'Value', '', 255],
    ['', 'Prior', '8bit', address.musicId, '!=', 'Value', '', 255],
  );

export const activeLevel = (level: number) => commonBuilders.simpleCmpOneConstant('8bit', address.activeLevel, level);

export const loadLevel = (level: number) =>
  $(activeLevel(level), commonBuilders.simpleCmpTwoConstants('8bit', address.gameState, 17, 18));

export const outOfLevel = () => commonBuilders.simpleCmpOneConstant('8bit', address.gameState, 14, '<=');

export const inLevel = () => commonBuilders.simpleCmpOneConstant('8bit', address.activeLevel, 0, '!=');

export const inOverworld = () =>
  $(
    commonBuilders.simpleCmpOneConstant('8bit', address.gameState, 11, '>='),
    commonBuilders.simpleCmpOneConstant('8bit', address.gameState, 15, '<='),
  );

export const titleScreen = () => commonBuilders.simpleCmpOneConstant('8bit', address.gameState, 10, '<=');

export const isPoweredUp = () => commonBuilders.simpleCmpOneConstant('8bit', address.powerUpState, 0, '!=');

export const notBeatenYet = () =>
  $(['AddAddress', 'Mem', '8bit', address.activeLevel], ['', 'Mem', 'Bit7', address.levelBase, '=', 'Value', '', 0]);
