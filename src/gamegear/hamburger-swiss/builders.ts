import { define as $, Condition } from '@cruncheevos/core';
import { address } from './data.js';
import { addSourceMultiple } from '../../common/builders.js';

export const currTotalScore = (target: number, cmp: Condition.OperatorComparison = '=') =>
  $(
    addSourceMultiple('Lower4', address.totalScoreHundreds, 100),
    addSourceMultiple('Lower4', address.totalScoreTens, 10),
    ['', 'Mem', 'Lower4', address.totalScoreOnes, cmp, 'Value', '', target],
  );

export const prevTotalScore = (target: number, cmp: Condition.OperatorComparison = '<') =>
  $(
    addSourceMultiple('Lower4', address.totalScoreHundreds, 100, 'Delta'),
    addSourceMultiple('Lower4', address.totalScoreTens, 10, 'Delta'),
    ['', 'Delta', 'Lower4', address.totalScoreOnes, cmp, 'Value', '', target],
  );
