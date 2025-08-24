import { define as $, AchievementSet, andNext, once, orNext, resetIf, trigger } from '@cruncheevos/core';

import {
  simpleCmpTwoConstants,
  simpleCurrCompare,
  simpleCurrPrevCmp,
  simplePrevCompare,
} from '../../common/builders.js';

import {
  alwaysOffDashMode,
  alwaysOnDashMode,
  beatStage,
  freshGame,
  gameOver,
  inStage,
  onArea,
  pickedUpDashCan,
  playerHealth,
  specialGet,
  startRobotMaster,
  usedDoubleJump,
  usedRmWeaponOrTool,
} from './builders.js';
import {
  address,
  bossLookup,
  majorGuardianLookup,
  robotMasterLookup,
  specialItemScreenLookup,
  stageLookup,
} from './data.js';

const makeCheevos = (set: AchievementSet): void => {
  set.addAchievement({
    title: 'Rock Man on Red Bull',
    points: 1,
    description: 'Pick up any Dash Can when not in Dash Mode to experience the difference.',
    conditions: $(alwaysOffDashMode(), pickedUpDashCan()),
  });

  for (let i = 0; i < 8; i++) {
    const specialData = specialItemScreenLookup[i];
    set.addAchievement({
      title: specialData[0],
      description: `Obtain ${specialData[1]} from ${stageLookup[i]}'s level.`,
      points: 3,
      conditions: specialGet(i, specialData[2], specialData[3]),
    });

    const robotData = robotMasterLookup[i];

    set.addAchievement({
      title: `Graceful Towards ${stageLookup[i]}`,
      description: `Reach ${stageLookup[i]}'s chamber from the start screen without losing lives or health.`,
      points: 10,
      conditions: once(andNext(onArea(0), simpleCmpTwoConstants('8bit', address.animationId, 8, 0)))
        .resetIf(inStage(i).withLast({ cmp: '!=' }))
        .resetIf(simpleCurrPrevCmp('8bit', address.playerHealth, '<'))
        .trigger(onArea(robotData.area - 1)),
    });

    set.addAchievement({
      title: robotData.weaponTitle,
      description: `Defeat ${stageLookup[i]} and acquire his weapon.`,
      points: 5,
      type: 'progression',
      conditions: inStage(i).also(onArea(robotData.area)).also(simpleCurrPrevCmp(robotData.clearBit, 0x6e)),
    });

    set.addAchievement({
      title: `Physics Lessons With ${stageLookup[i]}`,
      points: 5,
      description: `Defeat ${stageLookup[i]} in his stage using only the Rock Buster. No healing or Double Jumps either!`,
      conditions: inStage(i)
        .also(onArea(robotData.area))
        .once(simpleCurrPrevCmp('8bit', address.bossBar))
        .resetIf(usedDoubleJump())
        .resetIf(usedRmWeaponOrTool())
        .resetIf(simpleCurrPrevCmp('8bit', address.playerHealth))
        .resetIf(playerHealth(0))
        .trigger(
          andNext(
            simplePrevCompare('8bit', 0x458, 8, '<='),
            ['', 'Delta', 'BitCount', 0x458, '!=', 'Value', '', 0],
            simpleCurrCompare('8bit', 0x458, 0, '='),
          ),
        ),
    });

    set.addAchievement({
      title: `${stageLookup[i]} Can't Touch This`,
      points: 5,
      description: `Defeat ${stageLookup[i]} in his stage without getting hit.`,
      conditions: resetIf(inStage(i).withLast({ cmp: '!=' }))
        .also(onArea(robotData.area))
        .once(simpleCurrPrevCmp('8bit', address.bossBar))
        .resetIf(simpleCurrPrevCmp('8bit', address.playerHealth, '<'))
        .resetIf(playerHealth(0))
        .trigger(
          andNext(
            simplePrevCompare('8bit', 0x458, 8, '<='),
            ['', 'Delta', 'BitCount', 0x458, '!=', 'Value', '', 0],
            simpleCurrCompare('8bit', 0x458, 0, '='),
          ),
        ),
    });
  }

  // Have all of the single jump cheevos after since every item will be available then.
  for (let i = 0; i < 8; i++) {
    const data = robotMasterLookup[i];
    set.addAchievement({
      title: `Issac Newton vs. ${stageLookup[i]}`,
      points: 10,
      description: `Reach ${stageLookup[i]}'s chamber without double jumping a single time${i === 0 ? ' in normal gravity' : ''}.`,
      conditions: once(andNext(onArea(0), simpleCmpTwoConstants('8bit', address.animationId, 8, 0)))
        .resetIf(inStage(i).withLast({ cmp: '!=' }))
        .resetIf(andNext(i === 0 && '0xhaf=0', usedDoubleJump()))
        .trigger(onArea(data.area - 1)),
    });
  }

  for (let i = 8; i < 16; ++i) {
    const data = majorGuardianLookup[i];
    set.addAchievement({
      title: data.stageTitle,
      points: i == 15 ? 10 : 5,
      type: i == 15 ? 'win_condition' : 'progression',
      description: `Defeat ${bossLookup[i]} and ` + (i == 15 ? 'rescue Dr. Light.' : 'move on to the next stage.'),
      conditions: inStage(i)
        .also(onArea(data.area + (i == 15 ? 1 : 0)))
        .also(beatStage(i)),
    });

    if (i !== 11 && i !== 14) {
      set.addAchievement({
        title: `Issac Newton vs. ${bossLookup[i]}`,
        points: i === 15 ? 5 : 10,
        description:
          `Reach ${bossLookup[i]}'s chamber without double jumping a single time` +
          (i == 10 ? ` (vertical section excluded)` : '') +
          '.',
        conditions: once(andNext(onArea(0), simpleCmpTwoConstants('8bit', address.animationId, 8, 0)))
          .resetIf(inStage(i).withLast({ cmp: '!=' }))
          .resetIf(andNext(i == 10 && orNext(onArea(0), onArea(4).withLast({ cmp: '>' })), usedDoubleJump()))
          .trigger(onArea(data.area - 1)),
      });
    }

    set.addAchievement({
      title: `${bossLookup[i]} Can't Touch This`,
      points: 10,
      description: `Defeat ${bossLookup[i]} without getting hit.`,
      conditions: resetIf(inStage(i).withLast({ cmp: '!=' }))
        .also(andNext(onArea(data.area - 1, 'Delta'), once(onArea(data.area))))
        .once(simpleCurrPrevCmp('8bit', address.bossBar))
        .resetIf(simpleCurrPrevCmp('8bit', address.playerHealth, '<'))
        .resetIf(playerHealth(0))
        .trigger(
          andNext(
            simplePrevCompare('8bit', 0x458, 8, '<='),
            ['', 'Delta', 'BitCount', 0x458, '!=', 'Value', '', 0],
            simpleCurrCompare('8bit', 0x458, 0, '='),
          ).withLast({ hits: i == 15 ? 2 : 0 }),
        ),
    });
  }

  // All of the remaining cheevos (mainly full game ones) go here.

  set.addAchievement({
    title: `We Walkin' Here`,
    points: 25,
    description: `Beat the game from start to finish without ever using Dash Mode or Dash Cans.`,
    conditions: $(
      resetIf(alwaysOnDashMode()),
      resetIf(pickedUpDashCan()),
      once(andNext(freshGame(), startRobotMaster())),
      trigger(inStage(15), onArea(6), beatStage(15)),
    ),
  });

  set.addAchievement({
    title: `We Dashin' Here`,
    points: 10,
    description: `Beat the game from start to finish while in using Dash Mode.`,
    conditions: $(
      resetIf(alwaysOffDashMode()),
      once(andNext(freshGame(), startRobotMaster())),
      trigger(inStage(15), onArea(6), beatStage(15)),
    ),
  });

  const foundSpecialWeapons = [0xb5, 0xba, 0xbb, 0xbc];

  set.addAchievement({
    title: `We Collectin' Lots Here`,
    points: 25,
    description: `Beat the game from start to finish with every item in your possession.`,
    conditions: $(
      resetIf(
        andNext(
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
      ),
      once(andNext(freshGame(), startRobotMaster())),
      trigger(inStage(15), onArea(6), beatStage(15)),
    ),
  });

  set.addAchievement({
    title: `We Collectin' Little Here`,
    points: 25,
    description: `Beat the game from start to finish with none of the bonus eight items.`,
    conditions: $(
      resetIf(simpleCurrCompare('8bit', address.energyBalancer, 1)),
      resetIf(simpleCurrCompare('8bit', address.energyExchanger, 1)),
      resetIf(simpleCurrCompare('8bit', address.healEnhancer, 1)),
      resetIf(simpleCurrCompare('8bit', address.knockbackGuard, 1)),
      ...foundSpecialWeapons.map((f) => resetIf(simpleCurrCompare('Bit7', f, 1))),
      once(andNext(freshGame(), startRobotMaster())),
      trigger(inStage(15), onArea(6), beatStage(15)),
    ),
  });

  set.addAchievement({
    title: `We Survivin' Here`,
    points: 10,
    description: `Beat the game from start to finish with no game overs.`,
    conditions: $(
      resetIf(andNext(gameOver())),
      once(andNext(freshGame(), startRobotMaster())),
      trigger(inStage(15), onArea(6), beatStage(15)),
    ),
  });
};

export default makeCheevos;
