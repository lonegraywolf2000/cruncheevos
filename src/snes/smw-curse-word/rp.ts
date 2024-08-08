import { RichPresence } from '@cruncheevos/core';

import { rpMakeLookupLib } from '../../common/rp.js';
import { address, levelLookup } from './data.js';
import { inLevel, inOverworld, titleScreen } from './builders.js';

const makeRp = () => {
  const Lvl = rpMakeLookupLib('Lvl', '8bit', address.activeLevel, levelLookup);

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Lvl,
    },
    displays: ({ lookup, tag }) => [
      [titleScreen(), 'Preparing for immaturity in a sense.'],
      [inOverworld(), 'Oh where to go in this strange world...'],
      [inLevel(), tag`Trying to get through ${lookup.Lvl} relatively unscathed.`],
      'What exactly does slurdgery MEAN anyway?',
    ],
  });

  return rp;
};

export default makeRp;
