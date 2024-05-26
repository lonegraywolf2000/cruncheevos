import { writeFile } from 'fs/promises';
import { join } from 'path';

import { define as $, AchievementSet, ConditionBuilder } from '@cruncheevos/core';

import * as commonBuilders from '../../common/builders.js';
import { rpMakeLookup, rpMakeSimpleNumber } from '../../common/rp.js';
import { baseAddress, possibleOffsets } from './data.js';

const signLookup = {
  0: '+',
};

const windLookup = {
  0: '🡄',
  1: '🡆',
  2: '🡅',
  3: '🡇',
};

type RpDisplayCode = (offset: number) => [string, ConditionBuilder | undefined];

const makeRp = async (set: AchievementSet) => {
  const rpSign = rpMakeLookup('Sign', '8bit', signLookup, '-');
  const rpWindDir = rpMakeLookup('Wind', '8bit', windLookup);
  const displayCodes: RpDisplayCode[] = [
    (offset) => [
      'Playing Golf with a friend',
      $(
        commonBuilders.simpleCmpOneConstant('32bit', offset, 0xffffffff, '!='),
        commonBuilders.simpleCmpOneConstant('32bit', offset, 0xff000000, '!='),
        commonBuilders.simpleCmpOneConstant('8bit', baseAddress.gameType + offset, 0, '!='),
        commonBuilders.simpleCmpOneConstant('8bit', baseAddress.gameType + offset, 3, '<'),
      ),
    ],
    (offset) => [
      `End result: ${rpSign.point(0x12b, offset)}${rpMakeSimpleNumber(0x108 + offset, '8bit')}`,
      $(
        commonBuilders.simpleCmpOneConstant('32bit', offset, 0xffffffff, '!='),
        commonBuilders.simpleCmpOneConstant('32bit', offset, 0xff000000, '!='),
        commonBuilders.simpleCmpOneConstant('8bit', baseAddress.holeNumber + offset, 10),
      ),
    ],
    (offset) => [
      `Hole ${rpMakeSimpleNumber(baseAddress.holeNumber + offset, '8bit')}, Par ${rpMakeSimpleNumber(baseAddress.parAmount + offset, '8bit')} Wind ${rpWindDir.point(0x105, offset)}${rpMakeSimpleNumber(0x104 + offset, '8bit')}M Score ${rpSign.point(0x12b, offset)}${rpMakeSimpleNumber(0x108 + offset, '8bit')}`,
      $(
        commonBuilders.simpleCmpOneConstant('32bit', offset, 0xffffffff, '!='),
        commonBuilders.simpleCmpOneConstant('32bit', offset, 0xff000000, '!='),
        commonBuilders.simpleCmpOneConstant('8bit', baseAddress.holeNumber + offset, 0, '!='),
        commonBuilders.simpleCmpOneConstant('8bit', baseAddress.holeNumber + offset, 9, '<='),
      ),
    ],
  ];

  let result = [rpSign.rich, rpWindDir.rich].join('\n');
  result += `\nFormat:Number\nFormatType=VALUE\n\nDisplay:\n`;

  possibleOffsets.forEach((offset) => {
    displayCodes.forEach((dc) => {
      const [message, codes] = dc(offset);
      if (codes != undefined) {
        result += `?${[...codes].join('_')}?${message}\n`;
      } else {
        result += `${message}\n`;
      }
    });
  });
  result += `Preparing to Golf\n`;

  const rootDir = process.env.RACACHE;
  const targetFile = join(rootDir!, 'RACache', 'Data', `${set.gameId}-Rich.txt`);

  if (process.argv.some((a) => a === 'save' || a === 'diff-save')) {
    await writeFile(targetFile, result);
  } else {
    console.log(result);
  }
};

export default makeRp;
