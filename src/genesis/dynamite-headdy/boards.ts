import { define as $, AchievementSet } from '@cruncheevos/core';
import { secretBonusPointLookup, stageStartLookup } from './data.js';
import { actClear, inMenus, inStage, sceneStart } from './builders.js';
import { simpleCurrCompare } from '../../common/builders.js';

const makeBoards = (set: AchievementSet) => {
  for (const i in stageStartLookup) {
    const stage = Number(i);
    set.addLeaderboard({
      title: `Act ${i} Any%`,
      description: `Clear Act ${i} as fast as possible.`,
      id: 35847 + stage * 2,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inStage(stageStartLookup[stage]), sceneStart()),
        cancel: inMenus(),
        submit: actClear(stage),
        value: 'M:1=1',
      },
    });

    set.addLeaderboard({
      title: `Act ${i} Secret Bonus Points`,
      description: `Clear Act ${i} as fast as possible while collecting every secret bonus point.`,
      id: 35848 + stage * 2,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inStage(stageStartLookup[stage]), sceneStart()),
        cancel: {
          core: '1=1',
          alt1: inMenus(),
          alt2: $(actClear(stage), simpleCurrCompare('8bit', 0xe9fe + stage * 2, secretBonusPointLookup[stage], '<')),
        },
        submit: $(
          actClear(stage),
          simpleCurrCompare('8bit', 0xe9fe + stage * 2, secretBonusPointLookup[stage], stage === 3 ? '>=' : '='),
        ),
        value: 'M:1=1',
      },
    });
  }
};

export default makeBoards;
