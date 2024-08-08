import { define as $, andNext, RichPresence } from '@cruncheevos/core';

import { rpMakeLookupLib } from '../../common/rp.js';

import * as builders from './builders.js';
import { address, rpActionLookup, rpMapLookup, rpPurposeLookup } from './data.js';

const makeRp = () => {
  const Action = rpMakeLookupLib('Action', '8bit', address.mapId, rpActionLookup, 'blazing through');
  const Map = rpMakeLookupLib('Map', '8bit', address.mapId, rpMapLookup, 'the Freil Empire');
  const Purpose = rpMakeLookupLib('Purpose', '8bit', address.mapId, rpPurposeLookup, 'save souls');
  const level = RichPresence.macro.Number.at($(['Measured', 'BCD', '16bit', address.level]));
  const hp = RichPresence.macro.Number.at($(['Measured', 'Mem', '8bit', address.curHp]));
  const exp = RichPresence.macro.Number.at($(['Measured', 'BCD', '32bit', address.exp]));
  const gems = RichPresence.macro.Number.at($(['Measured', 'BCD', '16bit', address.gems]));

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Action,
      Map,
      Purpose,
    },
    displays: ({ lookup, tag }) => [
      [
        andNext(
          'once',
          builders.currentMap(0x7d),
          ['', 'Mem', '8bit', address.curHp, '!=', 'Value', '', 0],
          builders.deltaToZero('8bit', 0x8a5),
        ),
        `Blazer is successful in defeating Deathtoll.`,
      ],
      [$(builders.playerNotNamed()), `Blazer is learning how to save the Freil Empire.`],
      tag`Blazer is ${lookup.Action} ${lookup.Map} to ${lookup.Purpose}. Lvl: ${level}, HP: ${hp}, EXP: ${exp}, 💎: ${gems}.`,
    ],
  });

  return rp;
};

export default makeRp;
