import { define as $, AchievementSet, andNext, measured, once, resetIf } from '@cruncheevos/core';
import { cheevoLevels, levelLookup } from './data.js';
import { activeLevel, beatLevel, loadLevel, marioDied, notBeatenYet, outOfLevel, titleScreen } from './builders.js';

const makeBoards = (set: AchievementSet) => {
  cheevoLevels.forEach((level) => {
    const title = levelLookup[level];
    set.addLeaderboard({
      title: `${title} - Fewest Deaths`,
      description: 'Beat the level with as few deaths as possible.',
      lowerIsBetter: true,
      type: 'VALUE',
      conditions: {
        start: $(once(andNext(loadLevel(level))), resetIf(outOfLevel())),
        cancel: outOfLevel(),
        submit: beatLevel(),
        value: measured(andNext(marioDied())),
      },
    });
  });

  set.addLeaderboard({
    title: 'Full Game - Fewest Deaths',
    description: 'Beat the entire game with as few deaths as possible.',
    lowerIsBetter: true,
    type: 'VALUE',
    conditions: {
      start: $(loadLevel(1), notBeatenYet()),
      cancel: titleScreen(),
      submit: $(activeLevel(12), beatLevel()),
      value: measured(andNext(marioDied())),
    },
  });
};

export default makeBoards;
