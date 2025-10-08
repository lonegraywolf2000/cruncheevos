import { define as $, AchievementSet, measured } from '@cruncheevos/core';
import { clearedStackStage, clearedStage, inTitleScreen, isChallenge, isEasy } from './builders.js';
import { alwaysTrue, simpleCmpTwoConstants, simpleCurrCompare } from '../../common/builders.js';
import { address } from './data.js';

const makeBoards = (set: AchievementSet) => {
  set.addLeaderboard({
    title: 'Easy Mode Story',
    description: 'Clear the story on easy difficulty as fast as you can.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        isEasy(),
        simpleCmpTwoConstants('8bit', address.gameState, 0x08, 0x09)
      ),
      cancel: {
        core: alwaysTrue(),
        alt1: inTitleScreen(),
        alt2: simpleCurrCompare('8bit', address.gameState, 0x87)
      },
      submit: $(
        simpleCurrCompare('8bit', address.gameState, 0x5a),
        ...clearedStackStage().alt1.conditions.slice(-2),
      ),
      value: measured(alwaysTrue())
    }
  });

  set.addLeaderboard({
    title: 'Challenge Mode Story',
    description: 'Clear the story on challenge difficulty as fast as you can.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        isChallenge(),
        simpleCmpTwoConstants('8bit', address.gameState, 0x08, 0x09)
      ),
      cancel: {
        core: alwaysTrue(),
        alt1: inTitleScreen(),
        alt2: simpleCurrCompare('8bit', address.gameState, 0x87)
      },
      submit: $(
        simpleCurrCompare('8bit', address.gameState, 0x5a),
        ...clearedStackStage().alt2.conditions.slice(-2),
      ),
      value: measured(alwaysTrue())
    }
  });
};

export default makeBoards;
