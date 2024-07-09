import { writeFile } from 'fs/promises';
import { join } from 'path';

import { define as $, AchievementSet } from '@cruncheevos/core';
import { displayValue, makeRichPresenceDisplay, makeRichPresenceLookup } from '../../common/rp.js';
import { inOverworld, titleScreen } from './builders.js';
import { address, levelLookup } from './data.js';

const makeRp = async (set: AchievementSet) => {
  const rootDir = process.env.RACACHE;
  const targetFile = join(rootDir!, 'RACache', 'Data', `${set.gameId}-Rich.txt`);

  const rpLevelLookup = makeRichPresenceLookup(
    'Level',
    $(['Measured', 'Mem', '8bit', address.levelId]),
    Object.keys(levelLookup).reduce((prev: Record<number, string>, curr) => {
      prev[curr] = levelLookup[curr][0];
      return prev;
    }, {}),
  );

  const lookups = [rpLevelLookup].join('\n\n');

  const displays = [
    makeRichPresenceDisplay(titleScreen(), displayValue`Time to learn the fancy tricks.`),
    makeRichPresenceDisplay(inOverworld(), displayValue`What lesson will Mario learn now?`),
    makeRichPresenceDisplay(displayValue`Mario attempting to master the art of [${rpLevelLookup}]`),
  ].join('\n');
  const result = `${lookups}\n\nDisplay:\n${displays}`;

  if (process.argv.some((a) => a === 'save' || a === 'diff-save')) {
    await writeFile(targetFile, result);
  } else {
    console.log(result);
  }
};

export default makeRp;
