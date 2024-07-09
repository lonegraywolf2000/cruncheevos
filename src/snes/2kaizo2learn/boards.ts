import { define as $, AchievementSet, andNext, measured, once, resetIf } from '@cruncheevos/core';
import { levelLookup, levelsWithExit } from './data.js';
import { beatLevel, levelBeaten, loadLevel, marioDied, outOfLevel, startFullGameDeathless } from './builders.js';

const makeBoards = (set: AchievementSet) => {
  for (const key of levelsWithExit) {
    set.addLeaderboard({
      title: `${levelLookup[key][0]} - Fewest Deaths`,
      description: 'Beat the level with as few deaths as possible.',
      lowerIsBetter: true,
      type: 'VALUE',
      conditions: {
        start: $(once(andNext(loadLevel(key))), resetIf(outOfLevel())),
        cancel: outOfLevel(),
        submit: beatLevel(),
        value: measured(andNext(marioDied())),
      },
    });
  }

  set.addLeaderboard({
    title: 'All Levels - Fewest Deaths Single Segment',
    description: 'Beat all levels in one session with as few deaths as possible.',
    lowerIsBetter: true,
    type: 'VALUE',
    conditions: {
      start: startFullGameDeathless(),
      cancel: '0=1',
      submit: levelsWithExit.map(levelBeaten),
      value: measured(andNext(marioDied())),
    },
  });
};

export default makeBoards;
