import { RichPresence } from '@cruncheevos/core';
import { rpMakeLookupLib } from '../../common/rp.js';
import { actLookup, address, sceneLookup, stageLookup } from './data.js';
import { inDemos, inGameplay, inMenus, isGameOver, loadingScene, playingBasketball } from './builders.js';
import { simpleCurrCompare } from '../../common/builders.js';

const hardModeLookup = {
  1: ' (in Hard Mode)',
  '*': '',
};

const makeRp = () => {
  const Stage = rpMakeLookupLib('Stage', '8bit', address.currentStage, stageLookup, 'The Crowd');
  const PriorStage = rpMakeLookupLib('Stage', '8bit', address.currentStage, stageLookup, 'The Crowd', 'Prior');
  const Act = rpMakeLookupLib('Act', '8bit', address.currentStage, actLookup);
  const Scene = rpMakeLookupLib('Scene', '8bit', address.currentStage, sceneLookup);
  const Hard = rpMakeLookupLib('Hard', '8bit', address.hardMode, hardModeLookup);

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Hard,
      Stage,
      Act,
      Scene,
      PriorStage,
    },
    displays: ({ lookup, tag }) => [
      [inMenus(), `Applying makeup before getting under the lights.`],
      [inDemos(), `Headdy watching his own commercials for the play.`],
      [isGameOver(), `Headdy has been boo'ed off stage.`],
      [
        playingBasketball(),
        tag`Headdy${lookup.Hard} blowing off ${lookup.PriorStage} to play some Basketball? Really?`,
      ],
      [
        simpleCurrCompare('8bit', address.currentStage, 0x3c),
        tag`Headdy${lookup.Hard} preparing to run once the Opening Demo finishes.`,
      ],
      [
        simpleCurrCompare('8bit', address.currentStage, 0x46),
        tag`Headdy${lookup.Hard} relaxing after completing the play.`,
      ],
      [
        simpleCurrCompare('8bit', address.currentStage, 0x42),
        tag`Headdy${lookup.Hard} participating in the curtain call.`,
      ],
      [
        simpleCurrCompare('8bit', address.currentStage, 0x4a),
        tag`Headdy${lookup.Hard} is basking in the positive reviews.`,
      ],
      [
        simpleCurrCompare('8bit', address.currentStage, 0x4c),
        tag`Headdy${lookup.Hard} wants to have a word with the managers.`,
      ],
      [simpleCurrCompare('8bit', address.currentStage, 0x38), tag`Headdy${lookup.Hard} is battling the corrupt CEO.`],
      [
        simpleCurrCompare('8bit', address.currentStage, 0x4e),
        tag`Headdy${lookup.Hard} has reached THE END of their journey.`,
      ],
      [loadingScene(), tag`Headdy${lookup.Hard} cramming their lines in for ${lookup.Stage}.`],
      [
        inGameplay(),
        tag`Headdy${lookup.Hard} performing in ${lookup.Stage}, Act ${lookup.Act}, Scene ${lookup.Scene}. ACTION! 🎬`,
      ],
      `Ready to get ahead...alright, I'll see myself out.`,
    ],
  });
  console.log(rp.toString());
  return rp;
};

export default makeRp;
