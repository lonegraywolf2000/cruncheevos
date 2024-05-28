import { writeFile } from 'fs/promises';
import { join } from 'path';

import { AchievementSet } from '@cruncheevos/core';

import { rpMakeLookup } from '../../common/rp.js';
import { RpDisplayCode } from '../../common/types.js';
import { address, levelLookup } from './data.js';
import { simpleCurrCompare } from '../../common/builders.js';
import { currTotalScore } from './builders.js';

const makeRp = async (set: AchievementSet) => {
  const rpLevel = rpMakeLookup('Level', '8bit', levelLookup);
  const totalScore = currTotalScore(0).toString().replaceAll('A:', '').split('=')[0];
  const displayCodes: RpDisplayCode[] = [
    ['Can burgers grow from cedar trees?', simpleCurrCompare('16bit', address.gameState, 0x7c50)],
    ['Zybort 🍔 must lead the burgers to Switzerland!', simpleCurrCompare('16bit', address.gameState, 0x392e)],
    ['Zybort 🍔 has brought the burgers to Switzerland!', simpleCurrCompare('16bit', address.gameState, 0x5f72)],
    ['Zybort 🍔 has been defeated by the Milkshake Menace. 🥤', simpleCurrCompare('16bit', address.gameState, 0x7e94)],
    [
      `Zybort 🍔 has gone through the ${rpLevel.point(address.currentLevel)} w/@Number(${totalScore}) milkshakes 🥤 defeated.`,
      undefined,
    ],
  ];

  let result = [rpLevel.rich].join('\n');
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
