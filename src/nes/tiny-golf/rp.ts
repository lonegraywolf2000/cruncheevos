import { writeFile } from 'fs/promises';
import { join } from 'path';
import { AchievementSet } from '@cruncheevos/core';

import { rpMakeLookup, rpMakeSimpleNumber } from '../../common/rp.js';
import { RpDisplayCode } from '../../common/types.js';
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

const makeRp = async (set: AchievementSet) => {
  const rpPlayer = rpMakeSimpleNumber(address.playerCount, '8bit');
  const rpPlayerText = rpMakeLookup('Player', '8bit', playerLookup, 'Players');
  const rpHole = rpMakeLookup('Hole', '8bit', holeLookup, '9th');
  const displayCodes: RpDisplayCode[] = [
    [
      `${rpPlayer} ${rpPlayerText.point(address.playerCount)} on the ${rpHole.point(address.holeNumber)} green.`,
      undefined,
    ],
  ];

  let result = [rpHole.rich, rpPlayerText.rich].join('\n');
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
