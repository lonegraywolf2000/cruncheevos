import { define as $, addHits, andNext } from '@cruncheevos/core';
import { simpleCmpTwoConstants, simpleCurrCompare, simpleCurrPrevCmp, simplePrevCompare } from '../../common/builders.js';
import { address } from './data.js';

export const isSinglePlayer = () => simpleCurrCompare('8bit', address.gameMode, 0);

export const inGame = () => simpleCurrCompare('8bit', address.currentKong, 0, '!=');

export const inOverworld = () => simpleCurrCompare('8bit', address.kongWorldState, 0, '!=');
export const inLevel = () => simpleCurrCompare('8bit', address.kongWorldState, 0, '=');

export const inStage = (stage: number) => simpleCurrCompare('8bit', address.roomId, stage, '=');
export const inStageFromMap = (stage: number) => simpleCurrCompare('8bit', address.stageIdFromMap, stage, '=');
export const isBossDefeated = (musicId: number) => simpleCmpTwoConstants('8bit', address.musicId, musicId, 0x12);

export const gotAllLetters = () => andNext(
  simplePrevCompare('8bit', address.kongLetters, 0x90, '!='),
  addHits(simpleCurrCompare('8bit', address.kongLetters, 0x90, '=')).withLast({ hits: 1 }),
);

export const usedEarlyExit = () => $(
  simpleCurrPrevCmp('Bit6', address.gameState, '<'),
  simpleCurrPrevCmp('8bit', address.kongWorldState, '>'),
  simpleCurrCompare('Bit5', address.controllerInputsPlayer1, 1),
);

export const usedSplitUpGlitch = () => $(
  simplePrevCompare('8bit', address.gameFreezeAction, 0x09, '='),
  simpleCurrCompare('8bit', address.gameFreezeAction, 0x09, '!='),
  simpleCurrCompare('Bit0', address.gameState, 1),
)

export const currentKongRp = $(
  ['AddSource', 'Mem', 'Bit0', address.gameState, '*', 'Value', '', 10],
  ['Measured', 'Mem', '8bit', address.currentKong, '=', 'Value', '', 0],
);
