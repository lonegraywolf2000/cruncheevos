import { define as $, andNext, ConditionBuilder, RichPresence } from '@cruncheevos/core';
import { simpleCurrCompare } from '../../common/builders.js';
import { address, chapters, difficulty, mainStageSummary, playgroundData } from './data.js';
import { inPasswordScreen, inPlatformStage, inPlayground, inStory, inTitleScreen, isEasy, isGameOver, isGameState } from './builders.js';

const builderStripper = (code: ConditionBuilder) => {
  const str = code.toString();
  return str.substring(0, str.length - 2);
};

const makeRp = () => {
  const Difficulty: RichPresence.LookupParams = {
    values: difficulty,
    name: 'Difficulty',
    defaultAt: builderStripper(isEasy()),
  };
  const Collectible: RichPresence.LookupParams = {
    values: mainStageSummary.reduce((acc, { value, collectible }) => {
      acc[value] = collectible;
      return acc;
    }, {} as Record<number, string>),
    name: 'Collectible',
    defaultAt: builderStripper(isGameState(0)),
  };
  const Chapter: RichPresence.LookupParams = {
    values: chapters,
    name: 'Chapter',
    defaultAt: builderStripper(isGameState(0)),
  };
  const Playground: RichPresence.LookupParams = {
    values: playgroundData,
    name: 'Playground',
    defaultAt: builderStripper(isGameState(0)),
  };

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Number: 'VALUE',
    },
    lookup: {
      Difficulty,
      Chapter,
      Playground,
      Collectible,
    },
    displays: ({ lookup, macro, tag }) => [
      [
        inTitleScreen(),
        'Once upon a time, Snow White prepares to start this game made for children...',
      ],
      [
        isGameOver(),
        "And Snow White's tale ends in tragedy...wait, what?",
      ],
      [
        inPasswordScreen(),
        'And Snow White contemplates to skip parts of the story...wait, what?'
      ],
      [
        andNext(
          simpleCurrCompare('8bit', address.gameState, 0x5b, '>='),
          simpleCurrCompare('8bit', address.gameState, 0x5e, '<=')
        ),
        'And Snow White lived happily ever after.',
      ],
      [
        inPlatformStage(),
        tag`Chapter ${lookup.Chapter} on ${lookup.Difficulty} - ${macro.Number.at(`0xh${address.itemsCollected.toString(16)}`)}/${macro.Number.at(`0xh${address.itemsRequired.toString(16)}`)} ${lookup.Collectible}`
      ],
      [
        inStory(),
        tag`Chapter ${lookup.Chapter} on ${lookup.Difficulty}`,
      ],
      [
        inPlayground(),
        tag`Playground on ${lookup.Difficulty} - ${lookup.Playground}`
      ],
      'Once upon a time...you know the rest.'
    ]
  });
  return rp;
};

export default makeRp;
