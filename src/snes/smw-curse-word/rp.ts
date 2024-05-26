import { writeFile } from 'fs/promises';
import { join } from 'path';

import { AchievementSet } from '@cruncheevos/core';

import { rpMakeLookup } from '../../common/rp.js';
import { RpDisplayCode } from '../../common/types.js';
import { address, levelLookup } from './data.js';
import { inLevel, inOverworld, titleScreen } from './builders.js';

const makeRp = async (set: AchievementSet) => {
  const rpLevel = rpMakeLookup('Lvl', '8bit', levelLookup);
  const displayCodes: RpDisplayCode[] = [
    ['Preparing for immaturity in a sense.', titleScreen()],
    ['Oh where to go in this strange world...', inOverworld()],
    [`Trying to get through ${rpLevel.point(address.activeLevel)} relatively unscathed.`, inLevel()],
    ['What exactly does slurdgery MEAN anyway?', undefined],
  ];

  let result = [rpLevel.rich].join('\n');
  result += '\n';

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
