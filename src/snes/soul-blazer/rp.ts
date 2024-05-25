import { writeFile } from 'fs/promises';
import { join } from 'path';

import { define as $, AchievementSet, andNext } from '@cruncheevos/core';

import { rpMakeLookup, rpMakeSimpleNumber } from '../../common/rp.js';
import { RpDisplayCode } from '../../common/types.js';

import * as builders from './builders.js';
import { address, rpActionLookup, rpMapLookup, rpPurposeLookup } from './data.js';

const makeRp = async (set: AchievementSet) => {
  const rpAction = rpMakeLookup('Action', '8bit', rpActionLookup, 'blazing through');
  const rpMap = rpMakeLookup('Map', '8bit', rpMapLookup, 'the Freil Empire');
  const rpPurpose = rpMakeLookup('Purpose', '8bit', rpPurposeLookup, 'save souls');
  const rpLevel = rpMakeSimpleNumber(address.level, '16bit', 'BCD');
  const rpHp = rpMakeSimpleNumber(address.curHp, '8bit');
  const rpExp = rpMakeSimpleNumber(address.exp, '32bit', 'BCD');
  const rpGems = rpMakeSimpleNumber(address.gems, '16bit', 'BCD');

  const displayCodes: RpDisplayCode[] = [
    [
      `Blazer is successful in defeating Deathtoll.`,
      andNext(
        'once',
        builders.currentMap(0x7d),
        ['', 'Mem', '8bit', address.curHp, '!=', 'Value', '', 0],
        builders.deltaToZero('8bit', 0x8a5),
      ),
    ],
    [`Blazer is learning how to save the Freil Empire.`, $(builders.playerNotNamed())],
    [
      `Blazer is ${rpAction.point(address.mapId)} ${rpMap.point(address.mapId)} to ${rpPurpose.point(address.mapId)}. Lvl: ${rpLevel}, HP: ${rpHp}, EXP: ${rpExp}, 💎: ${rpGems}.`,
      undefined,
    ],
  ];

  let result = [rpAction.rich, rpMap.rich, rpPurpose.rich].join('\n');
  result += `\nFormat:Number\nFormatType=VALUE\n\nDisplay:\n`;

  for (const dc of displayCodes) {
    const [message, codes] = dc;
    if (codes != undefined) {
      result += `?${[...codes].join('_')}?${message}\n`;
    } else {
      result += `${message}\n`;
    }
  }

  const rootDir = process.env.RACACHE;
  const targetFile = join(rootDir!, 'RACache', 'Data', `${set.gameId}-Rich.txt`);

  if (process.argv.some((a) => a === 'save' || a === 'diff-save')) {
    await writeFile(targetFile, result);
  } else {
    console.log(result);
  }
};

export default makeRp;
