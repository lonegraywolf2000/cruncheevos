import { define as $, AchievementSet, andNext, orNext } from '@cruncheevos/core';
import {
  alwaysOffDashMode,
  alwaysOnDashMode,
  beatGame,
  beatStage,
  exitUnit,
  freshGame,
  gameOver,
  inStage,
  onArea,
  pickedUpDashCan,
  rmStageLbStart,
  startRobotMaster,
} from './builders.js';
import { address, bossLookup, stageLookup } from './data.js';
import { simpleCurrCompare } from '../../common/builders.js';

const makeBoards = (set: AchievementSet) => {
  set.addLeaderboard({
    title: `Any% Dashin'`,
    description: 'Beat the game from a new save. You can use either speed mode.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(freshGame(), startRobotMaster()),
      cancel: '0=1',
      submit: $(inStage(15), onArea(6), beatGame()),
      value: 'M:1=1',
    },
  });

  set.addLeaderboard({
    title: `Any% Walkin'`,
    description: 'Beat the game from a new save. No dashing allowed.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(freshGame(), alwaysOffDashMode(), startRobotMaster()),
      cancel: orNext(alwaysOnDashMode(), pickedUpDashCan()),
      submit: $(inStage(15), onArea(6), beatGame()),
      value: 'M:1=1',
    },
  });

  const foundSpecialWeapons = [0xb5, 0xba, 0xbb, 0xbc];

  set.addLeaderboard({
    title: `Low% Dashin'`,
    description: 'Beat the game from a new save and with no optional items. You can use either speed mode.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(freshGame(), startRobotMaster()),
      cancel: orNext(
        simpleCurrCompare('8bit', address.energyBalancer, 1),
        simpleCurrCompare('8bit', address.energyExchanger, 1),
        simpleCurrCompare('8bit', address.healEnhancer, 1),
        simpleCurrCompare('8bit', address.knockbackGuard, 1),
        ...foundSpecialWeapons.map((f) => simpleCurrCompare('Bit7', f, 1)),
      ),
      submit: $(inStage(15), onArea(6), beatGame()),
      value: 'M:1=1',
    },
  });

  set.addLeaderboard({
    title: `Low% Walkin'`,
    description: 'Beat the game from a new save and with no optional items. No dashing allowed.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(freshGame(), alwaysOffDashMode(), startRobotMaster()),
      cancel: orNext(
        alwaysOnDashMode(),
        pickedUpDashCan(),
        simpleCurrCompare('8bit', address.energyBalancer, 1),
        simpleCurrCompare('8bit', address.energyExchanger, 1),
        simpleCurrCompare('8bit', address.healEnhancer, 1),
        simpleCurrCompare('8bit', address.knockbackGuard, 1),
        ...foundSpecialWeapons.map((f) => simpleCurrCompare('Bit7', f, 1)),
      ),
      submit: $(inStage(15), onArea(6), beatGame()),
      value: 'M:1=1',
    },
  });

  set.addLeaderboard({
    title: `Max% Dashin'`,
    description: 'Beat the game from a new save and with all optional items. You can use either speed mode.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(freshGame(), startRobotMaster()),
      cancel: andNext(
        orNext(
          simpleCurrCompare('8bit', address.energyBalancer, 0),
          simpleCurrCompare('8bit', address.energyExchanger, 0),
          simpleCurrCompare('8bit', address.healEnhancer, 0),
          simpleCurrCompare('8bit', address.knockbackGuard, 0),
          ...foundSpecialWeapons.map((f) => simpleCurrCompare('Bit7', f, 0)),
        ),
        inStage(8),
        simpleCurrCompare('8bit', address.musicId, 0x08),
      ),
      submit: $(inStage(15), onArea(6), beatGame()),
      value: 'M:1=1',
    },
  });

  set.addLeaderboard({
    title: `Max% Walkin'`,
    description: 'Beat the game from a new save and with all optional items. No dashing allowed.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(freshGame(), alwaysOffDashMode(), startRobotMaster()),
      cancel: {
        core: '1=1',
        alt1: andNext(
          orNext(
            simpleCurrCompare('8bit', address.energyBalancer, 0),
            simpleCurrCompare('8bit', address.energyExchanger, 0),
            simpleCurrCompare('8bit', address.healEnhancer, 0),
            simpleCurrCompare('8bit', address.knockbackGuard, 0),
            ...foundSpecialWeapons.map((f) => simpleCurrCompare('Bit7', f, 0)),
          ),
          inStage(8),
          simpleCurrCompare('8bit', address.musicId, 0x08),
        ),
        alt2: orNext(alwaysOnDashMode(), pickedUpDashCan()),
      },
      submit: $(inStage(15), onArea(6), beatGame()),
      value: 'M:1=1',
    },
  });

  for (let i = 0; i < 16; i++) {
    set.addLeaderboard({
      title: `${stageLookup[i]} Walkin'`,
      description: `Enter the stage and defeat ${bossLookup[i]}. No dashing allowed.`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(alwaysOffDashMode(), rmStageLbStart(i)),
        cancel: {
          core: '1=1',
          alt1: exitUnit(),
          alt2: gameOver(),
          alt3: pickedUpDashCan(),
        },
        submit: beatStage(i),
        value: 'M:1=1',
      },
    });

    set.addLeaderboard({
      title: `${stageLookup[i]} Dashin'`,
      description: `Enter the stage and defeat ${bossLookup[i]}. You can use either speed mode.`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: rmStageLbStart(i),
        cancel: {
          core: '1=1',
          alt1: exitUnit(),
          alt2: gameOver(),
        },
        submit: beatStage(i),
        value: 'M:1=1',
      },
    });
  }
};

export default makeBoards;
