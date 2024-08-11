import { RichPresence } from '@cruncheevos/core';
import { rpMakeLookupLib } from '../../common/rp.js';
import { inOverworld, titleScreen } from './builders.js';
import { address, levelLookup } from './data.js';

const makeRp = () => {
  const Level = rpMakeLookupLib(
    'Level',
    '8bit',
    address.levelId,
    Object.keys(levelLookup).reduce((prev: Record<number, string>, curr) => {
      prev[curr] = levelLookup[curr][0];
      return prev;
    }, {}),
  );

  return RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Level,
    },
    displays: ({ lookup, tag }) => [
      [titleScreen(), `Time to learn the fancy tricks.`],
      [inOverworld(), `What lesson will Mario learn now?`],
      tag`Mario attempting to master the art of [${lookup.Level}]`,
    ],
  });
};

export default makeRp;
