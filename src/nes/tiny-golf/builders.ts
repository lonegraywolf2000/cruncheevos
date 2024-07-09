import { define as $, ConditionBuilder } from '@cruncheevos/core';

import { address, pars } from './data.js';
import { simpleCurrCompare, simplePrevCompare } from '../../common/builders.js';

type MultiplayerConditions = {
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

export const holeNumber = (hole: number): ConditionBuilder => simpleCurrCompare('8bit', address.holeNumber, hole);

const finishedHoleSingle = (addr: number): ConditionBuilder =>
  $(simplePrevCompare('8bit', addr, 0, '='), simpleCurrCompare('8bit', addr, 0, '!='));

const makeParSingle = (addr: number, target: number) => simpleCurrCompare('8bit', addr, target, '<=');

const madeParSingle = (addr: number, hole: number): ConditionBuilder => {
  return $(
    ['', 'Delta', '8bit', addr, '=', 'Value', '', 0],
    simpleCurrCompare('8bit', addr, 0, '!='),
    makeParSingle(addr, pars[hole]),
  );
};

export const madePar = (base: number, hole: number): MultiplayerConditions => {
  const target: Partial<MultiplayerConditions> = {
    core: holeNumber(hole),
  };
  [...Array(8)].forEach((_, p) => {
    const conditions = madeParSingle(base + p, hole);
    target[`alt${p + 1}`] = conditions;
  });
  return target as MultiplayerConditions;
};

export const madeTotalPar = (): MultiplayerConditions => {
  const target: Partial<MultiplayerConditions> = {
    core: holeNumber(8),
  };
  [...Array(8)].forEach((_, p) => {
    const conditions = $(
      finishedHoleSingle(address.hole9Base + p),
      simpleCurrCompare('8bit', address.totalScoreBase + p, 26, '<='),
    );
    target[`alt${p + 1}`] = conditions;
  });
  return target as MultiplayerConditions;
};

export const madeAllPar = (): MultiplayerConditions => {
  const target: Partial<MultiplayerConditions> = {
    core: holeNumber(8),
  };
  [...Array(8)].forEach((_, p) => {
    const conditions = [...Array(9)].map((_, h) =>
      $(simpleCurrCompare('8bit', 0x300 + h * 0x08 + p, 0, '!='), makeParSingle(0x300 + h * 0x08 + p, pars[h])),
    );
    target[`alt${p + 1}`] = conditions;
  });
  return target as MultiplayerConditions;
};
