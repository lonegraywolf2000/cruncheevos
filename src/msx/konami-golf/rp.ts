import { define as $, Condition, ConditionBuilder, RichPresence } from '@cruncheevos/core';

import * as commonBuilders from '../../common/builders.js';
import { baseAddress, possibleOffsets } from './data.js';

const signLookup = {
  0: '+',
};

const windLookup = {
  0: '🡄',
  1: '🡆',
  2: '🡅',
  3: '🡇',
};

const makeRp = () => {
  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Sign: {
        values: {
          ...signLookup,
          '*': '-',
        },
      },
      Wind: {
        values: windLookup,
      },
    },
    displays: ({ lookup, macro, tag }) => {
      const targets = possibleOffsets
        .flatMap((offset) => {
          const lSign = lookup.Sign.at(`0xh${(0x12b + offset).toString(16)}`);
          const lScore = macro.Number.at(`0xh${(0x108 + offset).toString(16)}`);
          const lHole = macro.Number.at(`0xh${(baseAddress.holeNumber + offset).toString(16)}`);
          const lPar = macro.Number.at(`0xh${(baseAddress.parAmount + offset).toString(16)}`);
          const lWindDir = lookup.Wind.at(`0xh${(0x105 + offset).toString(16)}`);
          const lWind = macro.Number.at(`0xh${(0x104 + offset).toString(16)}`);
          const target: Array<string | [Condition.Input | ConditionBuilder, string]> = [
            [
              $(
                commonBuilders.simpleCurrCompare('32bit', offset, 0xffffffff, '!='),
                commonBuilders.simpleCurrCompare('32bit', offset, 0xff000000, '!='),
                commonBuilders.simpleCurrCompare('8bit', baseAddress.gameType + offset, 0, '!='),
                commonBuilders.simpleCurrCompare('8bit', baseAddress.gameType + offset, 3, '<'),
              ),
              'Playing Golf with a friend',
            ],
            [
              $(
                commonBuilders.simpleCurrCompare('32bit', offset, 0xffffffff, '!='),
                commonBuilders.simpleCurrCompare('32bit', offset, 0xff000000, '!='),
                commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 10),
              ),
              tag`End result: ${lSign}${lScore}`,
            ],
            [
              $(
                commonBuilders.simpleCurrCompare('32bit', offset, 0xffffffff, '!='),
                commonBuilders.simpleCurrCompare('32bit', offset, 0xff000000, '!='),
                commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 0, '!='),
                commonBuilders.simpleCurrCompare('8bit', baseAddress.holeNumber + offset, 9, '<='),
              ),
              tag`Hole ${lHole}, Par ${lPar} Wind ${lWindDir}${lWind}M Score ${lSign}${lScore}`,
            ],
          ];

          return target;
        })
        .concat('Preparing to Golf');
      return targets;
    },
  });
  return rp;
};

export default makeRp;
