import { RichPresence } from '@cruncheevos/core';

import { rpMakeLookupLib } from '../../common/rp.js';
import { address, levelLookup } from './data.js';
import { simpleCurrCompare } from '../../common/builders.js';
import { measTotalScore } from './builders.js';

const makeRp = () => {
  const Level = rpMakeLookupLib('Level', '8bit', address.currentLevel, levelLookup);
  const totalScore = measTotalScore();

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Level,
    },
    displays: ({ lookup, macro, tag }) => [
      [simpleCurrCompare('16bit', address.gameState, 0x7c50), 'Can burgers grow from cedar trees?'],
      [simpleCurrCompare('16bit', address.gameState, 0x392e), 'Zybort 🍔 must lead the burgers to Switzerland!'],
      [simpleCurrCompare('16bit', address.gameState, 0x5f72), 'Zybort 🍔 has brought the burgers to Switzerland!'],
      [
        simpleCurrCompare('16bit', address.gameState, 0x7e94),
        'Zybort 🍔 has been defeated by the Milkshake Menace. 🥤',
      ],
      tag`Zybort 🍔 has gone through the ${lookup.Level} w/${macro.Number.at(totalScore)} milkshakes 🥤 defeated.`,
    ],
  });
  return rp;
};

export default makeRp;
