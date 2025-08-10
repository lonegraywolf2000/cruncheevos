import { define as $, ConditionBuilder, measured, orNext, RichPresence } from '@cruncheevos/core';
import {
  getRpBombs,
  getRpDeathCount,
  getRpDungeon,
  getRpHeartContainers,
  getRpItem,
  getRpKeys,
  getRpRupees,
  getRpTriforcePieces,
  inMenus,
  inOverworld,
  inSecondQuest,
  inZelda1,
  isGameOver,
  loadingMemoryCard,
  onScreen,
} from './builders.js';
import { address, dungeonLookup } from './data.js';
import { simpleCurrCompare } from '../../common/builders.js';

const regionLookup = {
  0x00: 'Death Mountain',
  0x01: 'Death Mountain',
  0x02: 'Death Mountain',
  0x03: 'Death Mountain',
  0x04: 'Death Mountain',
  0x05: 'Death Mountain',
  0x06: 'Death Mountain',
  0x07: 'Death Mountain',
  0x08: 'Death Mountain',
  0x09: 'Death Mountain',
  0x10: 'Death Mountain',
  0x11: 'Death Mountain',
  0x12: 'Death Mountain',
  0x13: 'Death Mountain',
  0x14: 'Death Mountain',
  0x15: 'Death Mountain',
  0x16: 'Death Mountain',
  0x0b: 'in the lost hills',
  0x0c: 'in the lost hills',
  0x0d: 'in the lost hills',
  0x1b: 'in the lost hills',
  0x1c: 'in the lost hills',
  0x1d: 'in the lost hills',
  0x0e: 'along the coast',
  0x0f: 'along the coast',
  0x1e: 'along the coast',
  0x1f: 'along the coast',
  0x2d: 'along the coast',
  0x2e: 'along the coast',
  0x2f: 'along the coast',
  0x3e: 'along the coast',
  0x3f: 'along the coast',
  0x4f: 'along the coast',
  0x5f: 'along the coast',
  0x6f: 'along the coast',
  0x7b: 'along the coast',
  0x7c: 'along the coast',
  0x7d: 'along the coast',
  0x7e: 'along the coast',
  0x7f: 'along the coast',
  0x20: 'by a graveyard',
  0x21: 'by a graveyard',
  0x22: 'by a graveyard',
  0x23: 'by a graveyard',
  0x24: 'by a graveyard',
  0x25: 'by a graveyard',
  0x30: 'by a graveyard',
  0x31: 'by a graveyard',
  0x32: 'by a graveyard',
  0x33: 'by a graveyard',
  0x40: 'by a graveyard',
  0x41: 'by a graveyard',
  0x50: 'by a graveyard',
  0x60: 'by a graveyard',
  0x17: 'along the river',
  0x18: 'along the river',
  0x19: 'along the river',
  0x1a: 'along the river',
  0x27: 'along the river',
  0x65: 'along the river',
  0x75: 'along the river',
  0x28: 'in the desert',
  0x29: 'in the desert',
  0x2a: 'in the desert',
  0x2b: 'in the desert',
  0x2c: 'in the desert',
  0x3a: 'in the desert',
  0x3b: 'in the desert',
  0x49: 'in the desert',
  0x4a: 'in the desert',
  0x4b: 'in the desert',
  0x3c: 'in the Lost Woods',
  0x3d: 'in the Lost Woods',
  0x4c: 'in the Lost Woods',
  0x4d: 'in the Lost Woods',
  0x4e: 'in the Lost Woods',
  0x5b: 'in the Lost Woods',
  0x5c: 'in the Lost Woods',
  0x5d: 'in the Lost Woods',
  0x5e: 'in the Lost Woods',
  0x6b: 'in the Lost Woods',
  0x6c: 'in the Lost Woods',
  0x6d: 'in the Lost Woods',
  0x6e: 'in the Lost Woods',
  0x51: 'in the Dead Woods',
  0x52: 'in the Dead Woods',
  0x53: 'in the Dead Woods',
  0x61: 'in the Dead Woods',
  0x62: 'in the Dead Woods',
  0x63: 'in the Dead Woods',
  0x64: 'in the Dead Woods',
  0x70: 'in the Dead Woods',
  0x71: 'in the Dead Woods',
  0x72: 'in the Dead Woods',
  0x73: 'in the Dead Woods',
  0x74: 'in the Dead Woods',
  0x57: 'close to start',
  0x58: 'close to start',
  0x66: 'close to start',
  0x67: 'close to start',
  0x68: 'close to start',
  0x76: 'close to start',
  0x77: 'close to start',
  0x78: 'close to start',
  0x79: 'close to start',
  0x7a: 'close to start',
  '*': 'by a lake',
};

const questLookup = {
  0: '1st',
  '*': '2nd',
};

const swordLookup = {
  1: '🗡️',
  2: '🗡️🗡️',
  3: '🗡️🗡️🗡️',
  '*': '🚫',
};

const itemLookup = {
  '*': '🚫',
  0x10: '🪃',
  0x20: '🪃',
  0x01: '💣',
  0x11: '💣',
  0x21: '💣',
  0x02: '🏹',
  0x12: '🏹',
  0x22: '🏹',
  0x04: '🕯️',
  0x14: '🕯️',
  0x24: '🕯️',
  0x05: '🎵',
  0x15: '🎵',
  0x25: '🎵',
  0x06: '🍖',
  0x16: '🍖',
  0x26: '🍖',
  0x07: '🍷',
  0x17: '🍷',
  0x27: '🍷',
  0x08: '✨',
  0x18: '✨',
  0x28: '✨',
  0x0f: '📜',
  0x1f: '📜',
  0x2f: '📜',
};

const builderStripper = (code: ConditionBuilder) => {
  const str = code.toString();
  return str.substring(0, str.length - 2);
};

const makeRp = () => {
  const Z1Region: RichPresence.LookupParams = {
    values: regionLookup,
    name: 'Z1Region',
    defaultAt: builderStripper(onScreen(0)),
  };
  const Z1Item: RichPresence.LookupParams = {
    values: itemLookup,
    name: 'Z1Item',
    defaultAt: builderStripper(getRpItem()),
  };
  const Z1Sword: RichPresence.LookupParams = {
    values: swordLookup,
    name: 'Z1Sword',
    defaultAt: builderStripper(simpleCurrCompare('8bit', address.sword, 0)),
  };
  const Z1Dungeon: RichPresence.LookupParams = {
    values: dungeonLookup,
    name: 'Z1Dungeon',
    defaultAt: builderStripper(getRpDungeon()),
  };
  const Z1Quest: RichPresence.LookupParams = {
    values: questLookup,
    name: 'Z1Quest',
    defaultAt: builderStripper(measured(inSecondQuest())),
  };
  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Z1Item,
      Z1Dungeon,
      Z1Quest,
      Z1Region,
      Z1Sword,
    },
    displays: ({ lookup, macro, tag }) => [
      [
        simpleCurrCompare('8bit', address.musicId, 0x10),
        tag`[Z1] (${lookup.Z1Quest} Quest) Link has become the hero of Hyrule. B[${lookup.Z1Item}] A[${lookup.Z1Sword}] ♥️${macro.Number.at(builderStripper(getRpHeartContainers('Lower4')))}/${macro.Number.at(builderStripper(getRpHeartContainers('Upper4')))} 💰${macro.Number.at(builderStripper(getRpRupees()))} 🗝️${macro.Number.at(builderStripper(getRpKeys()))} 💣${macro.Number.at(builderStripper(getRpBombs()))} 💎${macro.Number.at(builderStripper(getRpTriforcePieces()))} 💀${macro.Number.at(builderStripper(measured(getRpDeathCount())))}`,
      ],
      [$(inZelda1(), orNext(loadingMemoryCard(), inMenus())), `[Z1] Link's preparing for the nostalgic journey.`],
      [
        isGameOver(),
        tag`[Z1] (${lookup.Z1Quest} Quest) Link has been defeated. B[${lookup.Z1Item}] A[${lookup.Z1Sword}] ♥️${macro.Number.at(builderStripper(getRpHeartContainers('Lower4')))}/${macro.Number.at(builderStripper(getRpHeartContainers('Upper4')))} 💰${macro.Number.at(builderStripper(getRpRupees()))} 🗝️${macro.Number.at(builderStripper(getRpKeys()))} 💣${macro.Number.at(builderStripper(getRpBombs()))} 💎${macro.Number.at(builderStripper(getRpTriforcePieces()))} 💀${macro.Number.at(builderStripper(measured(getRpDeathCount())))}`,
      ],
      [
        $(inZelda1(), inOverworld()),
        tag`[Z1] (${lookup.Z1Quest} Quest) Link exploring ${lookup.Z1Region}. B[${lookup.Z1Item}] A[${lookup.Z1Sword}] ♥️${macro.Number.at(builderStripper(getRpHeartContainers('Lower4')))}/${macro.Number.at(builderStripper(getRpHeartContainers('Upper4')))} 💰${macro.Number.at(builderStripper(getRpRupees()))} 🗝️${macro.Number.at(builderStripper(getRpKeys()))} 💣${macro.Number.at(builderStripper(getRpBombs()))} 💎${macro.Number.at(builderStripper(getRpTriforcePieces()))} 💀${macro.Number.at(builderStripper(measured(getRpDeathCount())))}`,
      ],
      [
        inZelda1(),
        tag`[Z1] (${lookup.Z1Quest} Quest) Link exploring The ${lookup.Z1Dungeon} Dungeon. B[${lookup.Z1Item}] A[${lookup.Z1Sword}] ♥️${macro.Number.at(builderStripper(getRpHeartContainers('Lower4')))}/${macro.Number.at(builderStripper(getRpHeartContainers('Upper4')))} 💰${macro.Number.at(builderStripper(getRpRupees()))} 🗝️${macro.Number.at(builderStripper(getRpKeys()))} 💣${macro.Number.at(builderStripper(getRpBombs()))} 💎${macro.Number.at(builderStripper(getRpTriforcePieces()))} 💀${macro.Number.at(builderStripper(measured(getRpDeathCount())))}`,
      ],
      'Do not use this line.',
    ],
  });

  console.log(rp.toString());
  return rp;
};
export default makeRp;
