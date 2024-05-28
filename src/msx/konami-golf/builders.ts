import {
  define as $,
  Condition,
  ConditionBuilder,
  andNext,
  measured,
  once,
  orNext,
  pauseIf,
  resetIf,
  trigger,
} from '@cruncheevos/core';
import * as commonBuilders from '../../common/builders.js';
import { baseAddress, possibleOffsets } from './data.js';

type DumbConditions = {
  core: ConditionBuilder;
  alt1: ConditionBuilder;
  alt2: ConditionBuilder;
  alt3: ConditionBuilder;
  alt4: ConditionBuilder;
  alt5: ConditionBuilder;
  alt6: ConditionBuilder;
  alt7: ConditionBuilder;
  alt8: ConditionBuilder;
};

const changedHole = (addr: number) => commonBuilders.simpleCurrPrevCmp('8bit', addr, '!=');

const onePlayer = (addr: number) => commonBuilders.simpleCurrCompare('8bit', addr, 0);

const ballInHole = (addr: number) => commonBuilders.simpleCurrPrevCmp('8bit', addr, '<');

const sandTrap = (addr: number) => commonBuilders.simpleCurrCompare('8bit', addr, 1);
const outOfBounds = (addr: number) => commonBuilders.simpleCurrCompare('8bit', addr, 4);

const powerBarValue = (size: Condition.Size, addr: number, value: number) =>
  commonBuilders.simpleCurrCompare(size, addr, value);

const powerBarSame = (size: Condition.Size, addr: number) => commonBuilders.simpleCurrPrevCmp(size, addr, '=');

const withinPar = (shots: number, par: number) => $(['', 'Mem', '8bit', shots, '<=', 'Mem', '8bit', par]);

const startGame = (addr: number) =>
  andNext(['', 'Delta', '8bit', addr, '!=', 'Value', '', 207], ['', 'Mem', '8bit', addr, '=', 'Value', '', 207]);

const finishGame = (offset: number) =>
  $(
    commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 9),
    ballInHole(baseAddress.ballInHole + offset),
  );

const altProtection = (offset: number) =>
  pauseIf(
    ['', 'Mem', '32bit', offset, '=', 'Value', '', 0xffffffff],
    ['', 'Mem', '32bit', offset, '=', 'Value', '', 0xff000000],
  );

export const parCheevo = (hole: number): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      onePlayer(baseAddress.gameType + offset),
      commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, hole + 1),
      ['', 'Mem', '8bit', baseAddress.currentShots + offset, '<=', 'Mem', '8bit', baseAddress.parAmount + offset],
      ballInHole(baseAddress.ballInHole + offset),
    );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const powerBarCheevo = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      onePlayer(baseAddress.gameType + offset),
      powerBarValue('32bit', baseAddress.powerBar1 + offset, 0xcfcfcfcf),
      powerBarValue('32bit', baseAddress.powerBar2 + offset, 0xcfcfcfcf),
      powerBarValue('16bit', baseAddress.powerBar3 + offset, 0xcfcf),
      powerBarSame('24bit', baseAddress.powerBarSummary + offset),
    );
    target['alt' + (index + 1)] = conditions;
  });

  return target as DumbConditions;
};

export const sandTrapCheevo = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      onePlayer(baseAddress.gameType + offset),
      withinPar(baseAddress.currentShots + offset, baseAddress.parAmount + offset),
      once(sandTrap(baseAddress.ballStatus + offset)),
      resetIf(commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 0)),
      resetIf(changedHole(baseAddress.holeNumber + offset)),
      trigger(ballInHole(baseAddress.ballInHole + offset)),
    );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const boxCheevo = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      onePlayer(baseAddress.gameType + offset),
      once(startGame(baseAddress.soundByte + offset)),
      resetIf(commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 0)),
      resetIf(outOfBounds(baseAddress.ballStatus + offset)),
      trigger(finishGame(offset)),
    );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const holeInOneCheevo = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      onePlayer(baseAddress.gameType + offset),
      ['', 'Mem', '8bit', baseAddress.holeNumber + offset, '<=', 'Value', '', 9],
      ['', 'Mem', '8bit', baseAddress.holeNumber + offset, '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', baseAddress.currentShots + offset, '<=', 'Value', '', 1],
      ballInHole(baseAddress.ballInHole + offset),
    );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const leaderStart = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      onePlayer(baseAddress.gameType + offset),
      startGame(baseAddress.soundByte + offset),
    );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const leaderCancel = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      orNext(
        commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 0),
        commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 255),
      ),
    );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const leaderSubmit = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(finishGame(offset));
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const leaderValueTime = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $(['', 'Value', '', 1, '=', 'Value', '', 1]),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset).also(
      measured(commonBuilders.simpleCurrCompare('8bit', baseAddress.ballInHole + offset, 1)),
    );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};

export const leaderValueScore = (): DumbConditions => {
  const target: Partial<DumbConditions> = {
    core: $('1=1'),
  };
  possibleOffsets.forEach((offset, index) => {
    const conditions = altProtection(offset)
      .resetIf(
        commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 0),
        commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 255),
      )
      .also(
        // TODO: Convert this block to proper functions.
        ['SubSource', 'Delta', 'Upper4', 0x106 + offset, '*', 'Value', '', 10],
        ['SubSource', 'Delta', 'Lower4', 0x106 + offset],
        ['AddSource', 'Mem', 'Upper4', 0x106 + offset, '*', 'Value', '', 10],
        ['AddHits', 'Mem', 'Lower4', 0x106 + offset, '=', 'Value', '', 2],
        ['SubSource', 'Delta', 'Upper4', 0x106 + offset, '*', 'Value', '', 10],
        ['SubSource', 'Delta', 'Lower4', 0x106 + offset],
        ['AddSource', 'Mem', 'Upper4', 0x106 + offset, '*', 'Value', '', 10],
        ['AndNext', 'Mem', 'Lower4', 0x106 + offset, '!=', 'Value', '', 0],
        ['SubSource', 'Delta', 'Upper4', 0x106 + offset, '*', 'Value', '', 10],
        ['SubSource', 'Delta', 'Lower4', 0x106 + offset],
        ['AddSource', 'Mem', 'Upper4', 0x106 + offset, '*', 'Value', '', 10],
        ['Measured', 'Mem', 'Lower4', 0x106 + offset, '<=', 'Value', '', 2],
      );
    target['alt' + (index + 1)] = conditions;
  });
  return target as DumbConditions;
};
