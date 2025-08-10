import {
  define as $,
  andNext,
  ConditionBuilder,
  measured,
  measuredIf,
  measuredPercent,
  once,
  orNext,
  resetIf,
  trigger,
} from '@cruncheevos/core';
import { address, dungeonFinishData, DungeonScreenData } from './data.js';
import {
  simpleCmpTwoConstants,
  simpleCurrCompare,
  simpleCurrPrevCmp,
  simplePrevCompare,
} from '../../common/builders.js';

export const inZelda1 = () => simpleCurrCompare('8bit', 0x29b45, 1);

export const inSecondQuest = () =>
  $(['AddAddress', 'Mem', '8bit', address.saveSlot], simpleCurrCompare('8bit', address.quest2Check, 1));

export const inFirstQuest = () => inSecondQuest().withLast({ rvalue: { value: 0 } });

export const inMenus = () =>
  orNext(simpleCurrCompare('8bit', address.gameState, 1, '<='), simpleCurrCompare('8bit', address.gameState, 0x0e));

export const inOverworld = () => simpleCurrCompare('8bit', address.level, 0);

export const inLevel = (level: number) => {
  return $(level >= 0 && level <= 9 && simpleCurrCompare('8bit', address.level, level));
};

export const getRpDungeon = () =>
  measured(
    ['AddAddress', 'Mem', '8bit', address.saveSlot],
    ['AddSource', 'Mem', '8bit', address.quest2Check, '*', 'Value', '', 10],
    inLevel(0),
  );

const getHeartContainers = (size: 'Upper4' | 'Lower4', count: number) =>
  $(['AddSource', 'Value', '', 1], simpleCurrCompare(size, address.hearts, count));

export const getRpHeartContainers = (size: 'Upper4' | 'Lower4', count: number = 0) =>
  measured(getHeartContainers(size, count));

export const getRpRupees = () => simpleCurrCompare('8bit', address.rupees, 0);

export const getRpKeys = () => simpleCurrCompare('8bit', address.keys, 0);

export const getRpBombs = () => simpleCurrCompare('8bit', address.bombs, 0);

export const getRpTriforcePieces = () => simpleCurrCompare('BitCount', address.wisdom, 0);

export const getRpDeathCount = () =>
  $(['AddAddress', 'Mem', '8bit', address.saveSlot], simpleCurrCompare('8bit', address.deathCount, 0));

export const getRpItem = () =>
  $(
    ['Remember', 'Mem', '8bit', address.boomerang, '+', 'Mem', '8bit', address.boomerang + 1],
    ['AddSource', 'Recall', '', 0, '*', 'Value', '', 0x10],
    ['Measured', 'Mem', '8bit', address.bItem, '=', 'Value', '', 0],
  );

export const isGameOver = () =>
  orNext(simpleCurrCompare('8bit', address.gameState, 0x08), simpleCurrCompare('8bit', address.gameState, 0x11));

export const loadingMemoryCard = () => simpleCurrCompare('32bitBE', 0x1d6d40, 0xb06cfe7d);

export const onScreen = (screen: number) => simpleCurrCompare('8bit', address.screenId, screen);

export const pickedUpOverworldItem = () =>
  $(['AddAddress', 'Mem', '8bit', address.screenId], simpleCurrPrevCmp('Bit4', address.overworldStart));

export const pickedUpDungeonItem = (screen: number) =>
  $(
    onScreen(screen),
    onScreen(screen).withLast({ lvalue: { type: 'Delta' } }),
    ['Remember', 'Mem', '8bit', address.level, '/', 'Value', '', 7],
    ['Remember', 'Recall', '', 0, '*', 'Value', '', 0x80],
    ['AddAddress', 'Recall', '', 0, '+', 'Mem', '8bit', address.screenId],
    simpleCurrPrevCmp('Bit4', address.dungeonStart),
  );

export const beatGame = () =>
  $(simplePrevCompare('8bit', address.musicId, 0x20, '='), simpleCurrCompare('8bit', address.musicId, 0x06));

export const mapCheevoConditions = (data: DungeonScreenData[], quest: ConditionBuilder) => {
  return data.reduce(
    (prev, curr, index: number) => {
      prev[`alt${index + 1}`] = andNext(
        orNext(onScreen(curr.screens[0]), onScreen(curr.screens[1])),
        inLevel(curr.level),
      );
      return prev;
    },
    {
      core: $(
        measuredIf(inZelda1()),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        measuredIf(quest),
        ['AddSource', 'Delta', 'BitCount', address.map],
        ['AddSource', 'Delta', 'BitCount', address.compass],
        ['AddSource', 'Delta', 'Bit0', address.map + 2],
        ['', 'Delta', 'Bit0', address.compass + 2, '=', 'Value', '', 17],
        ['AddSource', 'Mem', 'BitCount', address.map],
        ['AddSource', 'Mem', 'BitCount', address.compass],
        ['AddSource', 'Mem', 'Bit0', address.map + 2],
        ['Measured', 'Mem', 'Bit0', address.compass + 2, '=', 'Value', '', 18],
      ),
    },
  );
};

export const fullKeyCheevoConditions = (data: DungeonScreenData[], quest: ConditionBuilder) => {
  const ramCoordinates = data
    .map((curr) => {
      const offset = curr.level < 7 ? 0 : 0x80;
      return curr.screens.map((s) => address.dungeonStart + offset + s);
    })
    .flat();

  return data.reduce(
    (prev, curr, index) => {
      prev[`alt${index + 1}`] = andNext(orNext(...curr.screens.map((s) => onScreen(s))), inLevel(curr.level));
      return prev;
    },
    {
      core: $(
        measuredIf(inZelda1()),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        measuredIf(quest),
        ...ramCoordinates.map((r) => $(['AddSource', 'Delta', 'Bit4', r])),
        ['', 'Value', '', 0, '=', 'Value', '', ramCoordinates.length - 1],
        ...ramCoordinates.map((r) => $(['AddSource', 'Mem', 'Bit4', r])),
        ['Measured', 'Value', '', 0, '=', 'Value', '', ramCoordinates.length],
      ),
    },
  );
};

export const fullHeartCheevoConditions = (data: [number, number][], quest: ConditionBuilder) => {
  return data.reduce(
    (prev, curr, index: number) => {
      prev[`alt${index + 1}`] = $(inLevel(curr[0]), onScreen(curr[1]));
      return prev;
    },
    {
      core: $(
        measuredIf(inZelda1()),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        measuredIf(quest),
        measuredIf(simpleCurrCompare('8bit', address.gameState, 1, '>')),
        measuredIf(simpleCurrCompare('8bit', address.gameState, 0x0e, '!=')),
        simplePrevCompare('Upper4', address.hearts, 0x0e, '='),
        getRpHeartContainers('Upper4', 16),
      ),
    },
  );
};

export const fullBombCheevoConditions = (data: [number, number][], quest: ConditionBuilder) => {
  return data.reduce(
    (prev, curr, index: number) => {
      prev[`alt${index + 1}`] = $(inLevel(curr[0]), onScreen(curr[1]));
      return prev;
    },
    {
      core: $(
        measuredIf(inZelda1()),
        loadingMemoryCard().withLast({ cmp: '!=' }),
        measuredIf(quest),
        measuredIf(simpleCurrCompare('8bit', address.capacity, 8, '>')),
        ['AddSource', 'Mem', '8bit', address.capacity, '/', 'Value', '', 8],
        ['Measured', 'Value', '', 0, '=', 'Value', '', 2],
        simpleCmpTwoConstants('8bit', address.capacity, 12, 16),
      ),
    },
  );
};

export const isHundredPercentFilled = () =>
  $(
    ['Remember', 'Mem', '8bit', address.capacity, '-', 'Value', '', 8],
    ['AddSource', 'Value', '', 1],
    ['AddSource', 'Mem', 'Upper4', address.hearts],
    ['AddSource', 'Mem', 'BitCount', address.wisdom],
    ['AddSource', 'Mem', '8bit', address.sword, '/', 'Value', '', 3],
    ['AddSource', 'Mem', '8bit', address.boomerang + 1],
    ['AddSource', 'Recall', '', 0, '/', 'Value', '', 4],
    ['AddSource', 'Mem', '8bit', address.bow],
    ['AddSource', 'Mem', '8bit', address.arrow, '/', 'Value', '', 2],
    ['AddSource', 'Mem', '8bit', address.candle, '/', 'Value', '', 2],
    ['AddSource', 'Mem', '8bit', address.recorder],
    ['AddSource', 'Mem', '8bit', address.letter, '/', 'Mem', '8bit', address.letter],
    ['AddSource', 'Mem', '8bit', address.rod],
    ['AddSource', 'Mem', '8bit', address.raft],
    ['AddSource', 'Mem', '8bit', address.book],
    ['AddSource', 'Mem', '8bit', address.ring, '/', 'Value', '', 2],
    ['AddSource', 'Mem', '8bit', address.ladder],
    ['AddSource', 'Mem', '8bit', address.magicKey],
    ['', 'Mem', '8bit', address.bracelet, '=', 'Value', '', 40],
  );

export const hundredPercentConditions = (quest: ConditionBuilder) => {
  const screen = dungeonFinishData[quest.conditions[1].rvalue.value * 9 + 8][3];
  return $(
    measuredIf(inZelda1()),
    loadingMemoryCard().withLast({ cmp: '!=' }),
    measuredIf(quest),
    measuredIf(simpleCurrCompare('8bit', address.gameState, 1, '>')),
    measuredIf(simpleCurrCompare('8bit', address.gameState, 0x0e, '!=')),
    inLevel(9),
    onScreen(screen),
    beatGame(),
    measuredPercent(isHundredPercentFilled()),
  );
};

export const newFileStart = () =>
  $(
    simpleCurrCompare('Upper4', address.hearts, 2),
    simpleCurrCompare('8bit', address.sword, 0),
    simpleCurrCompare('32bit', address.bombs, 0),
    simpleCurrCompare('32bit', address.recorder, 0),
    simpleCurrCompare('32bit', address.raft, 0),
    simpleCurrCompare('32bit', address.magicKey, 0),
    simpleCurrCompare('16bit', address.rupees, 0),
    simpleCurrCompare('BitCount', address.wisdom, 0),
    simpleCmpTwoConstants('8bit', address.gameState, 1, 2),
  );

export const deathlessConditions = (quest: ConditionBuilder) => {
  const questNum = quest.conditions[1].rvalue.value;
  return $(
    inZelda1(),
    loadingMemoryCard().withLast({ cmp: '!=' }),
    resetIf(
      ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
      ['', 'Value', '', 0, '=', 'Value', '', 0],
    ),
    resetIf(quest.withLast({ cmp: '!=' })),
    resetIf(simpleCurrCompare('8bit', address.gameState, 8)),
    resetIf(getRpDeathCount().withLast({ cmp: '!=' })),
    once(andNext(newFileStart())),
    trigger(inLevel(9)),
    trigger(onScreen(dungeonFinishData[8 + questNum * 9][3])),
    trigger(beatGame()),
  );
};

export const isLowishPercentCompatible = () =>
  $(
    simpleCurrCompare('8bit', address.sword, 3, '<'),
    simpleCurrCompare('8bit', address.ring, 2, '<'),
    simpleCurrCompare('Upper4', address.hearts, 8, '<'),
  );

export const lowishPercentConditions = (quest: ConditionBuilder) => {
  const questNum = quest.conditions[1].rvalue.value;
  return $(
    inZelda1(),
    loadingMemoryCard().withLast({ cmp: '!=' }),
    simpleCurrCompare('8bit', address.gameState, 1, '>'),
    simpleCurrCompare('8bit', address.gameState, 0x0e, '!='),
    quest,
    isLowishPercentCompatible(),
    trigger(inLevel(9)),
    trigger(onScreen(dungeonFinishData[8 + questNum * 9][3])),
    trigger(beatGame()),
  );
};
