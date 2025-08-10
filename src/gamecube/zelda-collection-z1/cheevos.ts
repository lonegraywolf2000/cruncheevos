import {
  define as $,
  AchievementSet,
  addHits,
  andNext,
  measuredIf,
  once,
  orNext,
  resetIf,
  resetNextIf,
  trigger,
} from '@cruncheevos/core';

import {
  simpleCmpTwoConstants,
  simpleCurrCompare,
  simpleCurrPrevCmp,
  simplePrevCompare,
  simplePriorCompare,
} from '../../common/builders.js';

import {
  address,
  arrowShopData,
  blueRingShopData,
  bombUp1Data,
  bombUp2Data,
  candleData,
  doorRepair2Data,
  dungeonFinishData,
  dungeonItemData,
  dungeonLookup,
  heartContainer1Data,
  heartContainer2Data,
  key1Data,
  key2Data,
  map1Data,
  map2Data,
  moneySecret1,
  moneySecret2,
  questAgnosticItemData,
} from './data.js';
import {
  beatGame,
  deathlessConditions,
  fullBombCheevoConditions,
  fullHeartCheevoConditions,
  fullKeyCheevoConditions,
  hundredPercentConditions,
  inFirstQuest,
  inLevel,
  inOverworld,
  inSecondQuest,
  inZelda1,
  loadingMemoryCard,
  lowishPercentConditions,
  mapCheevoConditions,
  onScreen,
  pickedUpDungeonItem,
} from './builders.js';

const makeCheevos = (set: AchievementSet) => {
  questAgnosticItemData.forEach((data) => {
    set.addAchievement({
      title: data[0],
      points: data[1],
      description: `[Z1] ${data[2]}`,
      conditions: $(
        inZelda1(),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        inLevel(0),
        onScreen(data[3]),
        simpleCurrPrevCmp('Bit4', address.overworldStart + data[3]),
      ),
    });
  });

  dungeonFinishData.forEach((data) => {
    const goal = data[2] == 9 ? 'Rescue Zelda' : 'Recover the Triforce fragment';
    const quest = data[1] == 0 ? '1st' : '2nd';
    set.addAchievement({
      title: data[0],
      points: data[2] == 9 ? 25 : data[2] < 6 ? 5 : 10,
      type: quest === '2nd' ? undefined : 'progression',
      description: `[Z1] ${goal} from the ${dungeonLookup[data[1] * 10 + data[2]]} Dungeon in the ${quest} quest`,
      conditions: $(
        inZelda1(),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        data[1] == 0 && inFirstQuest(),
        data[1] == 1 && inSecondQuest(),
        inLevel(data[2]),
        data[2] < 9 && pickedUpDungeonItem(data[3]),
        data[2] == 9 && $(onScreen(data[3]), beatGame()),
      ),
    });
  });

  dungeonItemData.forEach((data) => {
    const quest = data[2] == 0 ? '1st' : '2nd';
    set.addAchievement({
      title: data[0],
      points: 5,
      description: `[Z1] Acquire the ${data[1]} in the ${quest} quest`,
      conditions: $(
        inZelda1(),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        data[2] == 0 && inFirstQuest(),
        data[2] == 1 && inSecondQuest(),
        inLevel(data[3]),
        pickedUpDungeonItem(data[4]),
      ),
    });
  });

  set.addAchievement({
    title: 'Slow Burn',
    points: 4,
    description: `[Z1] Purchase a Blue Candle from any of the shops in either quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inLevel(0),
      simpleCurrPrevCmp('8bit', address.candle, '>'),
      simpleCmpTwoConstants('8bit', address.overworldStart - 1, 0, 0x3c),
      ...candleData.map((c, i) => {
        const lastFlag = i < candleData.length - 1 ? 'OrNext' : '';
        const target = c[0] * 0x100 + c[1];
        return $(
          ['AddAddress', 'Mem', '8bit', address.saveSlot],
          ['AddSource', 'Mem', '8bit', address.quest2Check, '*', 'Value', '', 0x100],
          [lastFlag, 'Mem', '8bit', address.screenId, '=', 'Value', '', target],
        );
      }),
    ),
  });

  set.addAchievement({
    title: 'Quiver Not Included',
    points: 5,
    description: `[Z1] Purchase a Wooden Arrow from a merchant in either quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inLevel(0),
      simpleCurrPrevCmp('8bit', address.arrow, '>'),
      simpleCmpTwoConstants('8bit', address.overworldStart - 1, 0, 80),
      ...arrowShopData.map((a, i) =>
        $([i < arrowShopData.length - 1 ? 'OrNext' : '', 'Mem', '8bit', address.screenId, '=', 'Value', '', a]),
      ),
    ),
  });

  set.addAchievement({
    title: 'Fashion Forward',
    points: 5,
    description: `[Z1] Purchase a blue ring from the rare shop in either quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inLevel(0),
      simpleCurrPrevCmp('8bit', address.ring, '>'),
      simpleCmpTwoConstants('8bit', address.overworldStart - 1, 0, 250),
      ...blueRingShopData.map((c, i) => {
        const lastFlag = i < blueRingShopData.length - 1 ? 'OrNext' : '';
        const target = c[0] * 0x100 + c[1];
        return $(
          ['AddAddress', 'Mem', '8bit', address.saveSlot],
          ['AddSource', 'Mem', '8bit', address.quest2Check, '*', 'Value', '', 0x100],
          [lastFlag, 'Mem', '8bit', address.screenId, '=', 'Value', '', target],
        );
      }),
    ),
  });

  set.addAchievement({
    title: `Master No More`,
    points: 5,
    description: `[Z1] Acquire the magical sword in the 1st quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inFirstQuest(),
      inLevel(0),
      onScreen(0x21),
      simpleCurrPrevCmp('Bit4', address.overworldStart + 0x21),
    ),
  });

  set.addAchievement({
    title: `Strength From Within Unleashes Strength Outward`,
    points: 5,
    description: `[Z1] Acquire the magical sword in the 2nd quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inSecondQuest(),
      inLevel(0),
      onScreen(0x09),
      simpleCurrPrevCmp('Bit4', address.overworldStart + 0x09),
    ),
  });

  set.addAchievement({
    title: 'Prescribing Points',
    points: 5,
    description: `[Z1] Obtain the prescription letter in the first quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inFirstQuest(),
      inOverworld(),
      onScreen(0x0e),
      simpleCurrPrevCmp('Bit4', address.overworldStart + 0x0e),
    ),
  });

  set.addAchievement({
    title: 'The Lynel Letter',
    points: 5,
    description: `[Z1] Obtain the prescription letter in the second quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inSecondQuest(),
      inOverworld(),
      onScreen(0x11),
      simpleCurrPrevCmp('Bit4', address.overworldStart + 0x11),
    ),
  });

  set.addAchievement({
    title: 'Who Is This Everybody?',
    points: 10,
    description: '[Z1] Collect every secret moblin money stash in the 1st quest',
    conditions: $(
      measuredIf(inZelda1()),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      measuredIf(inFirstQuest()),
      inOverworld(),
      ...moneySecret1.map((m) => $(['AddSource', 'Delta', 'Bit4', address.overworldStart + m])),
      ['', 'Value', '', 0, '=', 'Value', '', moneySecret1.length - 1],
      ...moneySecret1.map((m) => $(['AddSource', 'Mem', 'Bit4', address.overworldStart + m])),
      ['Measured', 'Value', '', 0, '=', 'Value', '', moneySecret1.length],
      ...moneySecret1.map((m, i) => {
        return $([i === moneySecret1.length - 1 ? '' : 'OrNext', 'Mem', '8bit', address.screenId, '=', 'Value', '', m]);
      }),
    ),
  });

  set.addAchievement({
    title: 'Secret No More',
    points: 10,
    description: '[Z1] Collect every secret moblin money stash in the 2nd quest',
    conditions: $(
      measuredIf(inZelda1()),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      measuredIf(inSecondQuest()),
      inOverworld(),
      ...moneySecret2.map((m) => $(['AddSource', 'Delta', 'Bit4', address.overworldStart + m])),
      ['', 'Value', '', 0, '=', 'Value', '', moneySecret2.length - 1],
      ...moneySecret2.map((m) => $(['AddSource', 'Mem', 'Bit4', address.overworldStart + m])),
      ['Measured', 'Value', '', 0, '=', 'Value', '', moneySecret2.length],
      ...moneySecret2.map((m, i) => {
        return $([i === moneySecret2.length - 1 ? '' : 'OrNext', 'Mem', '8bit', address.screenId, '=', 'Value', '', m]);
      }),
    ),
  });

  set.addAchievement({
    title: 'The Back Exit',
    points: 5,
    description: `[Z1] Leave the Dead Woods via the western exit in either quest`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inOverworld(),
      simplePrevCompare('8bit', address.screenId + 1, 0x61, '='),
      simpleCurrCompare('8bit', address.screenId + 1, 0x60),
    ),
  });

  set.addAchievement({
    title: 'The Cost of Fresh Air',
    points: 10,
    description: `[Z1] Uncover nine of the grumpy old men that charge for door repairs on either quest`,
    conditions: $(
      measuredIf(inZelda1()),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inOverworld(),
      ...doorRepair2Data.map((d) => $(['AddSource', 'Delta', 'Bit7', address.overworldStart + d])),
      ['', 'Value', '', 0, '=', 'Value', '', 8],
      ...doorRepair2Data.map((d) => $(['AddSource', 'Mem', 'Bit7', address.overworldStart + d])),
      ['Measured', 'Value', '', 0, '=', 'Value', '', 9],
      ...doorRepair2Data.map((d, i) => {
        const flag = i < doorRepair2Data.length - 1 ? 'OrNext' : '';
        return $([flag, 'Mem', '8bit', address.screenId, '=', 'Value', '', d]);
      }),
    ),
  });

  set.addAchievement({
    title: 'Full of Stamina',
    points: 10,
    type: 'missable',
    description: `[Z1] Have every heart container in your posession in the 1st quest`,
    conditions: fullHeartCheevoConditions(heartContainer1Data, inFirstQuest()),
  });

  set.addAchievement({
    title: 'Full of Rage Against Tolls',
    points: 10,
    type: 'missable',
    description: `[Z1] Have every heart container in your posession in the 2nd quest`,
    conditions: fullHeartCheevoConditions(heartContainer2Data, inSecondQuest()),
  });

  set.addAchievement({
    title: 'Nuanced Navigation',
    points: 10,
    description: `[Z1] Collect every map and compass in the 1st quest`,
    conditions: mapCheevoConditions(map1Data, inFirstQuest()),
  });

  set.addAchievement({
    title: 'Land of the No-Longer Lost',
    points: 10,
    description: `[Z1] Collect every map and compass in the 2nd quest`,
    conditions: mapCheevoConditions(map2Data, inSecondQuest()),
  });

  set.addAchievement({
    title: 'Preparation Is Key',
    points: 10,
    description: `[Z1] Collect every non-shop small key in the 1st quest`,
    conditions: fullKeyCheevoConditions(key1Data, inFirstQuest()),
  });

  set.addAchievement({
    title: 'The Key Points',
    points: 5,
    description: `[Z1] Collect every non-shop small key in the 2nd quest`,
    conditions: fullKeyCheevoConditions(key2Data, inSecondQuest()),
  });

  set.addAchievement({
    title: `Dodongo Season's Here`,
    points: 5,
    description: `[Z1] Upgrade your bomb capacity twice in the 1st quest`,
    conditions: fullBombCheevoConditions(bombUp1Data, inFirstQuest()),
  });

  set.addAchievement({
    title: `At Least It's Not a Toll`,
    points: 10,
    description: `[Z1] Upgrade your bomb capacity twice in the 2nd quest`,
    conditions: fullBombCheevoConditions(bombUp2Data, inSecondQuest()),
  });

  set.addAchievement({
    title: 'Agonizing Aquamentus',
    points: 5,
    type: 'missable',
    description: `[Z1] Defeat Aquamentus using only the Wooden Sword without taking damage and without moving to the left side of the room`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inLevel(1),
      once(
        andNext(
          simplePrevCompare('8bit', address.npc01Id, 0x3d, '!='),
          simpleCurrCompare('8bit', address.npc01Id, 0x3d),
        ),
      ),
      resetIf(simpleCurrCompare('8bit', address.sword, 2, '>=')),
      resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
      resetIf(simpleCurrPrevCmp('16bitBE', address.hearts, '<')),
      resetIf(simpleCurrCompare('8bit', address.linkX, 0x70, '<')),
      resetIf(simpleCurrCompare('Bit6', address.input, 1)),
      trigger(
        simplePrevCompare('8bit', 0x1d71c6, 0x10, '='),
        ['AddSource', 'Mem', '8bit', 0x1d71c6, '&', 'Value', '', 0x3f],
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
    ),
  });

  set.addAchievement({
    title: 'Devouring Dodongos',
    points: 10,
    description: `[Z1] Clear a room filled with three Dodongos fully using no more than 4 bombs`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      resetIf(
        ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
      resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
      resetIf(simpleCurrPrevCmp('8bit', address.bombs, '<').withLast({ hits: 5 })),
      once(
        andNext(
          orNext(
            simplePrevCompare('8bit', address.npc01Id, 0x31, '<'),
            simplePrevCompare('8bit', address.npc01Id, 0x32, '>'),
          ),
          simpleCurrCompare('24bit', address.npc01Id, 0x313131, '>='),
          simpleCurrCompare('24bit', address.npc01Id, 0x323232, '<='),
        ),
      ),
      trigger(
        andNext(
          ...[0, 1, 2].map((i) =>
            $(
              orNext(
                simpleCurrCompare('8bit', address.npc01Id + i, 0x31, '<'),
                simpleCurrCompare('8bit', address.npc01Id + i, 0x32, '>'),
              ),
              simplePrevCompare('8bit', address.npc01Id + i, 0x31, '>='),
              addHits(once(simplePrevCompare('8bit', address.npc01Id + i, 0x32, '<='))),
            ),
          ),
        ),
        ['', 'Value', '', 0, '=', 'Value', '', 1, 3],
      ),
    ),
  });

  // Target the third.
  set.addAchievement({
    title: `Managing Manhandla`,
    points: 5,
    type: 'missable',
    description: `[Z1] Defeat any Manhandla using only the Wooden or White Sword without getting hit 3 times`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      resetIf(
        ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
      resetIf(simpleCurrCompare('8bit', address.sword, 3)),
      resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
      resetIf(simpleCurrCompare('Bit6', address.input, 1)),
      resetIf(simpleCurrPrevCmp('16bitBE', address.hearts, '<').withLast({ hits: 3 })),
      once(
        andNext(
          simplePrevCompare('8bit', address.npc01Id, 0x3c, '!='),
          simpleCurrCompare('8bit', address.npc01Id, 0x3c),
        ),
      ),
      trigger(
        andNext(
          ...[0, 1, 2, 3, 4].map((i) =>
            $(
              simplePrevCompare('8bit', address.npc01Id + i, 0x3c, '='),
              addHits(once(simpleCurrCompare('8bit', address.npc01Id + i, 0x3c, '!='))),
            ),
          ),
        ),
        ['', 'Value', '', 0, '=', 'Value', '', 1, 5],
      ),
    ),
  });

  set.addAchievement({
    title: 'Grounding Gleeok',
    points: 10,
    type: 'missable',
    description: `[Z1] Defeat any Gleeok without using the Magical Sword, entering the bottom two rows, or getting hit 3 times`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      resetIf(
        ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
      resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
      resetIf(simpleCurrPrevCmp('16bitBE', address.hearts, '<').withLast({ hits: 3 })),
      resetIf(simpleCurrCompare('8bit', address.linkY, 0x9d, '>')),
      resetIf(andNext(simpleCurrCompare('8bit', address.sword, 3), simpleCurrCompare('Bit7', address.input, 1))),
      once(
        andNext(
          orNext(
            simplePrevCompare('8bit', address.npc01Id, 0x43, '<'),
            simplePrevCompare('8bit', address.npc01Id, 0x45, '>'),
          ),
          simpleCurrCompare('8bit', address.npc01Id, 0x43, '>='),
          simpleCurrCompare('8bit', address.npc01Id, 0x45, '<='),
        ),
      ),
      trigger(
        andNext(
          orNext(
            simpleCurrCompare('8bit', address.npc01Id, 0x43, '<'),
            simpleCurrCompare('8bit', address.npc01Id, 0x45, '>'),
          ),
          simplePrevCompare('8bit', address.npc01Id, 0x43, '>='),
          simplePrevCompare('8bit', address.npc01Id, 0x45, '<='),
        ),
      ),
    ),
  });

  // TODO: Learn what makes a digdogger spawn 3 kids.
  set.addAchievement({
    title: 'Disturbing Digdogger',
    points: 10,
    type: 'missable',
    description: `[Z1] Defeat any Digdogger that spawns three children using only recorders and swords, and without getting hit twice`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      resetIf(
        ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
      resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
      resetIf(simpleCurrPrevCmp('16bitBE', address.hearts, '<').withLast({ hits: 2 })),
      resetIf(andNext(simpleCurrCompare('8bit', address.bItem, 5, '!='), simpleCurrCompare('Bit6', address.input, 1))),
      resetIf(andNext(inFirstQuest(), inLevel(5))),
      resetIf(inLevel(9)),
      resetIf(andNext(inLevel(7), onScreen(0x6c))),
      once(
        andNext(
          orNext(
            simplePrevCompare('8bit', address.npc01Id, 0x38, '<'),
            simplePrevCompare('8bit', address.npc01Id, 0x39, '>'),
          ),
          simplePrevCompare('8bit', address.npc01Id, 0x18, '!='),
          simpleCurrCompare('8bit', address.npc01Id, 0x38, '>='),
          simpleCurrCompare('8bit', address.npc01Id, 0x39, '<='),
        ),
      ),
      trigger(once(andNext(simpleCmpTwoConstants('24bit', address.npc01Id + 1, 0, 0x181818)))),
      trigger(
        andNext(
          ...[0, 1, 2].map((i) =>
            $(
              simplePrevCompare('8bit', address.npc01Id + 1 + i, 0x18, '='),
              addHits(simpleCurrCompare('8bit', address.npc01Id + 1 + i, 0x18, '!=').withLast({ hits: 1 })),
            ),
          ),
        ),
        ['', 'Value', '', 0, '=', 'Value', '', 1, 3],
      ),
    ),
  });

  set.addAchievement({
    title: 'Gouging Gohma',
    points: 10,
    type: 'missable',
    description: `[Z1] Defeat any gohma while staying on the bottom two rows and firing as few shots as possible`,
    conditions: {
      core: $(
        inZelda1(),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        resetIf(
          ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
          ['', 'Value', '', 0, '=', 'Value', '', 0],
        ),
        resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
        resetIf(simpleCurrCompare('8bit', address.linkY, 0xa5, '<=')),
      ),
      alt1: $(
        resetIf(
          andNext(
            simpleCurrCompare('8bit', address.npc01Id, 0x34),
            simpleCurrPrevCmp('8bit', address.rupees, '<').withLast({ hits: 2 }),
          ),
        ),
        once(
          andNext(
            simplePrevCompare('8bit', address.npc01Id, 0x34, '!='),
            simpleCurrCompare('8bit', address.npc01Id, 0x34),
          ),
        ),
        trigger(
          andNext(
            simplePrevCompare('8bit', address.npc01Id, 0x34, '='),
            simpleCurrCompare('8bit', address.npc01Id, 0x34, '!='),
          ),
        ),
      ),
      alt2: $(
        resetIf(
          andNext(
            simpleCurrCompare('Bit1', address.arrow, 0),
            simpleCurrCompare('8bit', address.npc01Id, 0x33),
            simpleCurrPrevCmp('8bit', address.rupees, '<').withLast({ hits: 4 }),
          ),
        ),
        resetIf(
          andNext(
            simpleCurrCompare('Bit1', address.arrow, 1),
            simpleCurrCompare('8bit', address.npc01Id, 0x33),
            simpleCurrPrevCmp('8bit', address.rupees, '<').withLast({ hits: 3 }),
          ),
        ),
        once(
          andNext(
            simplePrevCompare('8bit', address.npc01Id, 0x33, '!='),
            simpleCurrCompare('8bit', address.npc01Id, 0x33),
          ),
        ),
        trigger(
          andNext(
            simplePrevCompare('8bit', address.npc01Id, 0x33, '='),
            simpleCurrCompare('8bit', address.npc01Id, 0x33, '!='),
          ),
        ),
      ),
    },
  });

  set.addAchievement({
    title: 'Pulverizing Patra',
    points: 10,
    type: 'missable',
    description: '[Z1] Defeat any Patra in the game without taking damage',
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      resetIf(
        ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
      resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
      resetIf(simpleCurrPrevCmp('16bitBE', address.hearts, '<')),
      resetIf(inLevel(9).withLast({ cmp: '!=' })),
      once(
        andNext(
          orNext(
            simplePrevCompare('8bit', address.npc01Id, 0x47, '<'),
            simplePrevCompare('8bit', address.npc01Id, 0x48, '>'),
          ),
          simpleCurrCompare('8bit', address.npc01Id, 0x47, '>='),
          simpleCurrCompare('8bit', address.npc01Id, 0x48, '<='),
        ),
      ),
      trigger(
        andNext(
          orNext(
            simpleCurrCompare('8bit', address.npc01Id, 0x47, '<'),
            simpleCurrCompare('8bit', address.npc01Id, 0x48, '>'),
          ),
          simplePrevCompare('8bit', address.npc01Id, 0x47, '>='),
          simplePrevCompare('8bit', address.npc01Id, 0x48, '<='),
        ),
      ),
    ),
  });

  set.addAchievement({
    title: 'Gutting Ganon',
    points: 10,
    type: 'missable',
    description: `[Z1] Deliver the coup de grace to Ganon within 45 seconds`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      resetIf(
        ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
      resetIf(simpleCurrPrevCmp('8bit', address.screenId + 1, '!=')),
      resetIf(inLevel(9).withLast({ cmp: '!=' })),
      once(
        andNext(
          simplePrevCompare('8bit', address.npc01Id, 0x3e, '!='),
          simpleCurrCompare('8bit', address.npc01Id, 0x3e),
        ),
      ),
      once(
        andNext(
          simplePrevCompare('16bit', address.songOffset, 0x92cc, '='),
          simpleCurrCompare('16bit', address.songOffset, 0x91fd),
        ),
      ),
      resetNextIf(simpleCurrCompare('16bit', address.songOffset, 0x92cc)),
      resetIf(
        andNext(
          simpleCurrCompare('8bit', address.npc01Id, 0x3e),
          simplePriorCompare('16bit', address.songOffset, 0x92cc, '='),
          simpleCurrCompare('16bit', address.songOffset, 0x91fd).withLast({ hits: 2700 }),
        ),
      ),
      simplePrevCompare('8bit', 0x1d6e01, 0, '='),
      trigger(
        ['AddSource', 'Mem', '8bit', 0x1d6e01, '&', 'Value', '', 0xc0],
        ['', 'Value', '', 0, '=', 'Value', '', 0xc0],
      ),
    ),
  });

  set.addAchievement({
    title: 'Prepared For Anything',
    points: 25,
    type: 'missable',
    description: `[Z1] Beat the game in the 1st quest with all heart containers, items, & capacities upgraded to their max`,
    conditions: hundredPercentConditions(inFirstQuest()),
  });

  set.addAchievement({
    title: `At Least There's No Weight Or Burden Limit`,
    points: 25,
    type: 'missable',
    description: `[Z1] Beat the game in the 2nd quest with all heart containers, items, & capacities upgraded to their max`,
    conditions: hundredPercentConditions(inSecondQuest()),
  });

  set.addAchievement({
    title: 'Hyrule Survivor',
    points: 25,
    type: 'missable',
    description: `[Z1] Beat the 1st quest in one session with no deaths or menu warps`,
    conditions: deathlessConditions(inFirstQuest()),
  });

  set.addAchievement({
    title: 'All This Just for Points? No Kiss? Well Excuuuuuuse Me Princess!',
    points: 50,
    type: 'missable',
    description: `[Z1] Beat the 2nd quest in one session with no deaths or menu warps`,
    conditions: deathlessConditions(inSecondQuest()),
  });

  set.addAchievement({
    title: 'Low Percent Practice',
    points: 25,
    type: 'missable',
    description: `[Z1] Beat the 1st quest with 8 hearts or less, no magical sword, and no red ring`,
    conditions: lowishPercentConditions(inFirstQuest()),
  });

  set.addAchievement({
    title: 'Managing Minimalism',
    points: 50,
    type: 'missable',
    description: `[Z1] Beat the 2nd quest with 8 hearts or less, no magical sword, and no red ring`,
    conditions: lowishPercentConditions(inSecondQuest()),
  });

  set.addAchievement({
    title: `I Wonder What's for Dinner`,
    points: 50,
    type: 'missable',
    description: `[Z1] Visit Ganon's room in the 1st quest without any swords`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inFirstQuest(),
      simpleCurrCompare('8bit', address.sword, 0),
      inLevel(9),
      simplePrevCompare('16bit', address.songOffset, 0x92cc, '='),
      simpleCurrCompare('16bit', address.songOffset, 0x91fd),
    ),
  });

  set.addAchievement({
    title: `Hope The Cakes Aren't Burnt`,
    points: 50,
    type: 'missable',
    description: `[Z1] Visit Ganon's room in the 2nd quest without any swords`,
    conditions: $(
      inZelda1(),
      loadingMemoryCard().withLast({ cmp: '!=' }),
      inSecondQuest(),
      simpleCurrCompare('8bit', address.sword, 0),
      inLevel(9),
      simplePrevCompare('16bit', address.songOffset, 0x92cc, '='),
      simpleCurrCompare('16bit', address.songOffset, 0x91fd),
    ),
  });
};

export default makeCheevos;
