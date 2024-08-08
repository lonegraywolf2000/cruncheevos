import { define as $, RichPresence } from '@cruncheevos/core';

import { rpMakeLookupLib } from '../../common/rp.js';
import { address, gradeLookup, screenLookup } from './data.js';
import { inGameMisc, onResultScreen, playingGame } from './builders.js';

const makeRp = () => {
  const CurrGame = rpMakeLookupLib('Game', '8bit', address.screenId, screenLookup);
  const Grade = rpMakeLookupLib('Grade', '8bit', address.earnedGrade, gradeLookup);
  const perfect = RichPresence.macro.Number.at($(['Measured', 'Mem', '8bit', address.hitsPerfect]));
  const ok = RichPresence.macro.Number.at($(['Measured', 'Mem', '8bit', address.hitsOk]));

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      CurrGame,
      Grade,
    },
    displays: ({ lookup, tag }) => [
      [
        onResultScreen(),
        tag`Result of ${lookup.CurrGame.at($(['Measured', 'Prior', '8bit', address.screenId]))}: ${lookup.Grade}!`,
      ],
      [playingGame(), tag`Playing ${lookup.CurrGame}: ${perfect} Perfect and ${ok} OK so far.`],
      [inGameMisc(), tag`Jammming on the ${lookup.CurrGame}.`],
      'Entering Rhythm Land',
    ],
  });
  return rp;
};

export default makeRp;
