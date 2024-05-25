import { writeFile } from 'fs/promises';
import { join } from 'path';

import { define as $, AchievementSet, Condition, ConditionBuilder, andNext } from '@cruncheevos/core';

import * as builders from './builders.js';
import { address, rpActionLookup, rpMapLookup, rpPurposeLookup } from './data.js';

const reverseLookup = (obj: Record<number, string>): Record<string, number[]> => {
  const target: Record<string, number[]> = {};
  for (const key in obj) {
    if (obj[key] in target) {
      target[obj[key]].push(Number(key));
    } else {
      target[obj[key]] = [Number(key)];
    }
  }
  for (const key in target) {
    target[key].sort((a, b) => (a < b ? -1 : 1));
  }
  return target;
};

const rpMakeLookup = (
  name: string,
  prefix: string,
  obj: Record<number, string>,
  fallback: string | undefined = undefined,
) => {
  let rich = `Lookup:${name}\n`;
  const reverse = reverseLookup(obj);
  for (const key in reverse) {
    const allNums = reverse[key].join(',');
    rich += `${allNums}=${key}\n`;
  }
  if (fallback) {
    rich += `*=${fallback}\n`;
  }

  return {
    rich,
    point(address: number) {
      return `@${name}(0x${prefix}${address.toString(16).toUpperCase()})`;
    },
  };
};

const rpMakeSimpleNumber = (addr: number, size: Condition.Size, valueType: Condition.ValueType = 'Mem') => {
  const condition = $(['', valueType, size, addr, '=', 'Value', '', 0]).toString();
  return `@Number(${condition.substring(0, condition.length - 2)})`;
};

const makeRp = async (set: AchievementSet) => {
  const rpAction = rpMakeLookup('Action', 'H', rpActionLookup, 'blazing through');
  const rpMap = rpMakeLookup('Map', 'H', rpMapLookup, 'the Freil Empire');
  const rpPurpose = rpMakeLookup('Purpose', 'H', rpPurposeLookup, 'save souls');
  const rpLevel = rpMakeSimpleNumber(address.level, '16bit', 'BCD');
  const rpHp = rpMakeSimpleNumber(address.curHp, '8bit');
  const rpExp = rpMakeSimpleNumber(address.exp, '32bit', 'BCD');
  const rpGems = rpMakeSimpleNumber(address.gems, '16bit', 'BCD');

  const displayCodes: Array<[string, ConditionBuilder | undefined]> = [
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
