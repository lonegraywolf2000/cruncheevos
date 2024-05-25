import { writeFile } from 'fs/promises';
import { join } from 'path';

import { AchievementSet } from '@cruncheevos/core';

import { rpMakeLookup, rpMakeSimpleNumber } from '../../common/rp.js';
import { address, gradeLookup, screenLookup } from './data.js';
import { RpDisplayCode } from '../../common/types.js';
import { inGameMisc, onResultScreen, playingGame } from './builders.js';

const makeRp = async (set: AchievementSet) => {
  const rpPriorGame = rpMakeLookup('Game', '8bit', screenLookup, undefined, 'Prior');
  const rpCurrGame = rpMakeLookup('Game', '8bit', screenLookup);
  const rpGrade = rpMakeLookup('Grade', '8bit', gradeLookup);
  const rpPerfect = rpMakeSimpleNumber(address.hitsPerfect, '8bit');
  const rpOk = rpMakeSimpleNumber(address.hitsOk, '8bit');

  const displayCodes: RpDisplayCode[] = [
    [`Result of ${rpPriorGame.point(address.screenId)}: ${rpGrade.point(address.earnedGrade)}!`, onResultScreen()],
    [`Playing ${rpCurrGame.point(address.screenId)}: ${rpPerfect} Perfect & ${rpOk} OK so far.`, playingGame()],
    [`Jamming on the ${rpCurrGame.point(address.screenId)}.`, inGameMisc()],
    ['Entering Rhythm Land', undefined],
  ];

  let result = [rpCurrGame.rich, rpGrade.rich].join('\n');
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
