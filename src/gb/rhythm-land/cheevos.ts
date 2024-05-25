import { define as $, AchievementSet } from '@cruncheevos/core';

import { cheevoData, screenLookup } from './data.js';
import { earnedGrade, onResultScreenFromGame, revealGrade } from './builders.js';

const makeCheevos = (set: AchievementSet): void => {
  cheevoData.forEach((data) => {
    set.addAchievement({
      title: data.title,
      type: data.type || '',
      points: data.points,
      description: `Get ${data.suffix} ranking on ${screenLookup[data.game]}.`,
      conditions: $(onResultScreenFromGame(data.game), earnedGrade(data.grade), revealGrade()),
    });
  });
};

export default makeCheevos;
