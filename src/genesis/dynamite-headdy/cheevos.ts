import {
  define as $,
  AchievementSet,
  addHits,
  andNext,
  measuredIf,
  pauseIf,
  resetIf,
  trigger,
} from '@cruncheevos/core';
import { address, allSecretsStageData, clearStageData, hardClearStageData, stageEndLookup } from './data.js';
import { actClear, gameOver, inGameplay, inHardMode, inMenus, inStage, preventLevelSelect, secretBonusPointTotal } from './builders.js';
import {
  simpleCmpTwoConstants,
  simpleCurrCompare,
  simpleCurrPrevCmp,
  simplePrevCompare,
} from '../../common/builders.js';

const numberToOrdinal = (act: number) => {
  switch (act) {
    case 1:
      return 'first';
    case 2:
      return 'second';
    case 3:
      return 'third';
    case 4:
      return 'fourth';
    case 5:
      return 'fifth';
    case 6:
      return 'sixth';
    case 7:
      return 'seventh';
    case 8:
      return 'eigth';
    case 9:
      return 'ninth';
  }
};

const powerUpValues: number[] = [];
[...Array(19).keys()].forEach((index) => {
  const target = (index + 1) * 0x20;
  if (target !== 0x180) {
    powerUpValues.push(target);
  }
});

const makeCheevos = (set: AchievementSet): void => {
  for (const i in stageEndLookup) {
    const stage = Number(i);
    set.addAchievement({
      title: clearStageData[stage][0],
      points: clearStageData[stage][1],
      description: `Clear the ${numberToOrdinal(stage)} act`,
      id: 13365 - stage * 2,
      type: stage == 9 ? 'win_condition' : 'progression',
      conditions: {
        core: $(preventLevelSelect(), inGameplay(), inStage(stageEndLookup[stage]), actClear(stage)),
        alt1: gameOver(),
      },
    });
  }

  for (const i in stageEndLookup) {
    const stage = Number(i);
    set.addAchievement({
      title: `${hardClearStageData[stage][0]}`,
      points: hardClearStageData[stage][1],
      description: `Clear the ${numberToOrdinal(stage)} act on Hard mode`,
      id: 13364 - stage * 2,
      conditions: {
        core: $(inGameplay(), inStage(stageEndLookup[stage]), actClear(stage), inHardMode()),
      },
    });
  }

  for (const i in allSecretsStageData) {
    const stage = Number(i);
    set.addAchievement({
      title: allSecretsStageData[stage],
      points: 10,
      description: `Clear the ${numberToOrdinal(stage)} act after finding every secret bonus point`,
      id: 13481 + stage,
      conditions: $(inGameplay(), secretBonusPointTotal(stage)),
    });
  }

  set.addAchievement({
    title: `Laundry and Lunacy`,
    description: 'Clear the third act after finding the unintended secret bonus point against the boss',
    points: 10,
    conditions: $(
      inGameplay(),
      resetIf(inStage(0x14).withLast({ cmp: '!=' })),
      resetIf(simpleCurrPrevCmp('8bit', address.livesCount, '!=')),
      simpleCurrPrevCmp('8bit', address.secretBonusPointsFound, '>').withLast({ hits: 2 }),
      trigger(actClear(3)),
    ),
    id: 13491,
  });

  const trainingCheevoData: [string, string, number][] = [
    ['A Good Head on My Shoulders', 'Headcase', 0x08],
    ['Just Hanging Around', 'Hangman', 0x0a],
    ['Stay on Target', 'Beau', 0x0e],
  ];

  for (const data of trainingCheevoData) {
    set.addAchievement({
      title: data[0],
      points: 5,
      description: `Clear ${data[1]}'s training and earn a (not-so) secret bonus point in the process`,
      conditions: $(
        inGameplay(),
        inStage(data[2]),
        ['', 'Delta', '16bit', address.musicId, '=', 'Value', '', 0xffba],
        ['', 'Mem', '16bit', address.musicId, '=', 'Value', '', 0x72c9],
      ),
    });
  }

  set.addAchievement({
    title: 'Art Versus Economics',
    description: 'Clear the post-game act',
    points: 25,
    conditions: $(inMenus().withLast({ cmp: '>=' }), simpleCmpTwoConstants('8bit', address.currentStage, 0x38, 0x4e)),
    badge: '347184',
    id: 13495,
  });

  set.addAchievement({
    title: `They Don't Pay Me Enough`,
    description: 'Clear the post-game act on Hard mode',
    points: 50,
    conditions: $(
      inMenus().withLast({ cmp: '>=' }),
      simpleCmpTwoConstants('8bit', address.currentStage, 0x38, 0x4e),
      inHardMode(),
    ),
    id: 13493,
  });

  set.addAchievement({
    title: 'Five Star Review',
    description: 'Beat every act (including post-game) while collecting every non-glitched secret bonus point',
    points: 50,
    conditions: $(
      inMenus().withLast({ cmp: '>=' }),
      simpleCmpTwoConstants('8bit', address.currentStage, 0x38, 0x4e),
      ['', 'Mem', '8bit', 0xea00, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', 0xea02, '=', 'Value', '', 8],
      ['', 'Mem', '8bit', 0xea04, '>=', 'Value', '', 4],
      ['', 'Mem', '8bit', 0xea06, '=', 'Value', '', 7],
      ['', 'Mem', '8bit', 0xea08, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0xea0a, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0xea0c, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0xea0e, '=', 'Value', '', 6],
      ['', 'Mem', '8bit', 0xea10, '=', 'Value', '', 4],
    ),
    id: 13496,
  });

  set.addAchievement({
    title: `It's All in The Details`,
    description: 'Beat the game while collecting every non-glitched secret bonus point',
    points: 50,
    conditions: $(
      resetIf(inMenus()),
      ['', 'Mem', '8bit', 0xea00, '=', 'Value', '', 1, 1],
      ['', 'Mem', '8bit', 0xea02, '=', 'Value', '', 8, 1],
      ['', 'Mem', '8bit', 0xea04, '>=', 'Value', '', 4, 1],
      ['', 'Mem', '8bit', 0xea06, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0xea08, '=', 'Value', '', 3, 1],
      ['', 'Mem', '8bit', 0xea0a, '=', 'Value', '', 3, 1],
      ['', 'Mem', '8bit', 0xea0c, '=', 'Value', '', 3, 1],
      ['', 'Mem', '8bit', 0xea0e, '=', 'Value', '', 6, 1],
      ['', 'Mem', '8bit', 0xea10, '=', 'Value', '', 4, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 0x46, 1],
    ),
    id: 13492,
  });

  set.addAchievement({
    title: 'Working it Out on The Courts',
    points: 25,
    description: 'Find all four secret digits through the use of basketball',
    id: 13345,
    conditions: $(
      resetIf(inMenus()),
      ...[0, 1, 2, 3].map((i) => addHits(simpleCurrCompare('16bit', 0xe9c4 + i * 2, 9, '<=').withLast({ hits: 1 }))),
      'M:0=1.4.',
    ),
  });

  set.addAchievement({
    title: 'One Hit Wonder',
    points: 1,
    id: 13370,
    description: 'Turn on Hard mode',
    conditions: $(
      simpleCurrCompare('8bit', 0xe8fe, 6),
      simpleCmpTwoConstants('8bit', address.programState, 0x0c, 0x18),
      simpleCmpTwoConstants('8bit', address.hardMode, 0, 1),
    ),
  });

  set.addAchievement({
    title: 'Smorgasbord of Skulls',
    points: 5,
    id: 13295,
    description: 'Use every Headcase power-up at least once',
    conditions: $(
      measuredIf(
        inMenus().withLast({
          cmp: '>=',
        }),
      ),
      ...powerUpValues.map((val) => $(['AddHits', 'Mem', '16bit', 0xee0a, '=', 'Value', '', val, 1])),
      $(['Measured', 'Value', '', 0, '=', 'Value', '', 1, 18]),
      /*
      // Redundant check here.
      ...powerUpValues.map((val) => $(['OrNext', 'Delta', '16bit', 0xee0a, '=', 'Value', '', val])),
      $(['', 'Delta', '16bit', 0xee0a, '=', 'Value', '', 0]),
      */
    ),
  });

  set.addAchievement({
    title: 'Some Assembly Required',
    id: 13499,
    points: 4,
    description: 'Acquire enough Keymaster fragments after defeating a boss to earn a continue',
    conditions: $(
      inGameplay(),
      simpleCurrPrevCmp('8bit', 0xe93c),
      ...[0x06, 0x14, 0x1e, 0x56, 0x20, 0x2a].map((val) =>
        $([val !== 0x2a ? 'OrNext' : '', 'Mem', '8bit', address.currentStage, '=', 'Value', '', val]),
      ),
    ),
  });

  //#region Cheevos to be demoted.

  set.addAchievement({
    title: '[VOID] Star of The Show',
    description: 'Beat the game in one session',
    points: 25,
    conditions: $(
      ['ResetIf', 'Mem', '8bit', 0xe802, '=', 'Value', '', 12],
      ['ResetIf', 'Mem', '8bit', 0xe802, '=', 'Value', '', 8],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 0, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 6, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 20, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 52, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 30, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 86, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 32, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 42, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 48, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 70, 1],
    ),
    id: 13494,
  });

  set.addAchievement({
    title: '[VOID] Solo Spotlight',
    description: 'Beat the game in one session on Hard mode',
    points: 50,
    conditions: $(
      ['ResetIf', 'Mem', '8bit', 0xe802, '=', 'Value', '', 12],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 0, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 6, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 20, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 52, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 30, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 86, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 32, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 42, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 48, 1],
      ['', 'Mem', '8bit', 0xe8c2, '=', 'Value', '', 70, 1],
      ['', 'Mem', '8bit', 0xef38, '=', 'Value', '', 1, 1],
    ),
    id: 13498,
  });

  set.addAchievement({
    title: `[VOID] A Taste of What's to Come`,
    points: 1,
    id: 13297,
    description: 'Watch the entire demo',
    conditions: $(
      simplePrevCompare('16bit', 0xe800, 0x1700),
      simpleCurrCompare('16bit', 0xe800, 0x1700),
      simpleCurrCompare('8bit', address.currentStage, 0x02),
      simpleCurrCompare('8bit', address.programState, 0x2c),
    ),
  });

  set.addAchievement({
    title: '[VOID] Aerial Maneuvers',
    points: 4,
    description: 'Ascend off the ground 500 times',
    id: 13500,
    conditions: $(
      andNext(simpleCmpTwoConstants('8bit', 0xd701, 0x00, 0xff)).withLast({ hits: 500 }),
      pauseIf(
        inGameplay().withLast({
          cmp: '!=',
        }),
      ),
    ),
  });

  //#endregion
};

export default makeCheevos;
