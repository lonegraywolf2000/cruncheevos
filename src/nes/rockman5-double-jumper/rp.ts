import { andNext, once, orNext, RichPresence } from '@cruncheevos/core';
import { rpMakeLookupLib } from '../../common/rp.js';
import { simpleCurrCompare, simplePriorCompare } from '../../common/builders.js';

import { address, bossLookup, stageLookup } from './data.js';
import { onArea } from './builders.js';

const stageSelectLookup = {
  0: 'Stone',
  1: 'Gravity',
  2: 'Crystal',
  3: 'Charge',
  5: 'Napalm',
  6: 'Wave',
  7: 'Star',
  8: 'Gyro',
  '*': 'Some',
};

const speedLookup = {
  0: `walkin'`,
  '*': `dashin'`,
};

const makeRp = () => {
  const Boss = rpMakeLookupLib('Boss', '8bit', address.currentStage, bossLookup, 'Out Of Bounds Man');
  const RmSelect: RichPresence.LookupParams = {
    values: stageSelectLookup,
    name: 'RmSelect',
    defaultAt: `A:0xH10*3_M:0xH11`,
  };
  const RmStage = rpMakeLookupLib('RmStage', '8bit', address.currentStage, stageLookup, 'Out Of Bounds Man');
  const Speed: RichPresence.LookupParams = {
    values: speedLookup,
    name: 'Speed',
    defaultAt: `A:0xH51_M:0xH66`,
  };
  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Boss,
      RmSelect,
      RmStage,
      Speed,
    },
    displays: ({ lookup, tag }) => [
      [
        once(
          andNext(
            simpleCurrCompare('8bit', address.currentStage, 0x0f),
            simpleCurrCompare('8bit', address.musicId, 0x4a),
          ),
        ),
        tag`And Wily is defeated yet again.`,
      ],
      [
        andNext(
          simpleCurrCompare('8bit', address.musicId, 0x0a),
          simpleCurrCompare('8bit', address.currentStage, 0x0e),
        ),
        tag`Currently ${lookup.Speed} towards ${lookup.Boss}.`,
      ],
      [
        orNext(
          simpleCurrCompare('8bit', address.musicId, 0x0a),
          simplePriorCompare('8bit', address.musicId, 0x0a, '='),
          simpleCurrCompare('8bit', address.musicId, 0x0b),
          simplePriorCompare('8bit', address.musicId, 0x0b, '='),
          simpleCurrCompare('8bit', address.musicId, 0x16),
          simplePriorCompare('8bit', address.musicId, 0x16, '='),
        ),
        tag`Fighting against ${lookup.Boss}.`,
      ],
      [
        andNext(
          orNext(
            simpleCurrCompare('8bit', address.musicId, 0x11),
            simplePriorCompare('8bit', address.musicId, 0x11, '='),
          ),
          onArea(0).withLast({ cmp: '!=' }),
        ),
        tag`Victorious against ${lookup.Boss}!`,
      ],
      [simpleCurrCompare('8bit', address.musicId, 0x0d), tag`Thinking of visiting ${lookup.RmSelect} Man.`],
      [simpleCurrCompare('8bit', address.musicId, 0x0e), tag`Entering ${lookup.RmStage}'s stage.`],
      [simpleCurrCompare('8bit', address.musicId, 0x14), tag`Celebrating with ${lookup.RmStage}'s weapon acquired.`],
      [simpleCurrCompare('8bit', address.musicId, 0x13), tag`Taking stock after visiting ${lookup.RmStage}.`],
      tag`Currently ${lookup.Speed} towards ${lookup.Boss}.`,
    ],
  });
  console.log(rp.toString());
  return rp;
};

export default makeRp;
