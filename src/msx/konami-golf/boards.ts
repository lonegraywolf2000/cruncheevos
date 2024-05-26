import { AchievementSet } from '@cruncheevos/core';
import * as builders from './builders.js';

const makeBoards = (set: AchievementSet): void => {
  set.addLeaderboard({
    title: '9 Hole Time Attack',
    description: 'Complete all 9 holes as fast as you can.',
    lowerIsBetter: true,
    type: 'TIME',
    id: 42092,
    conditions: {
      start: builders.leaderStart(),
      cancel: builders.leaderCancel(),
      submit: builders.leaderSubmit(),
      value: builders.leaderValueTime(),
    },
  });

  set.addLeaderboard({
    title: '9 Hole Lowest Shots',
    description: 'Complete all 9 holes in as few shots as possible.',
    lowerIsBetter: true,
    type: 'VALUE',
    id: 42093,
    conditions: {
      start: builders.leaderStart(),
      cancel: builders.leaderCancel(),
      submit: builders.leaderSubmit(),
      value: builders.leaderValueScore(),
    },
  });
};

export default makeBoards;
