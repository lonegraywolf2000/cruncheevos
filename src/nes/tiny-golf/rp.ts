import { define as $, RichPresence } from '@cruncheevos/core';

import { rpMakeLookupLib } from '../../common/rp.js';
import { address } from './data.js';

const playerLookup = {
  1: 'Player',
};

const holeLookup = {
  0: '1st',
  1: '2nd',
  2: '3rd',
  3: '4th',
  4: '5th',
  5: '6th',
  6: '7th',
  7: '8th',
};

const makeRp = () => {
  const Player = rpMakeLookupLib('Player', '8bit', address.playerCount, playerLookup, 'Players');
  const Hole = rpMakeLookupLib('Hole', '8bit', address.holeNumber, holeLookup, '9th');
  const Count = RichPresence.macro.Number.at($(['Measured', 'Mem', '8bit', address.playerCount]));

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Player,
      Hole,
    },
    displays: ({ lookup, tag }) => [tag`${Count} ${lookup.Player} on the ${lookup.Hole} green.`],
  });
  console.log(rp.toString());
  return rp;
};

export default makeRp;
