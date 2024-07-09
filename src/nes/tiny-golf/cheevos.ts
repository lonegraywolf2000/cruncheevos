import { AchievementSet } from '@cruncheevos/core';

import { parData } from './data.js';
import { madeAllPar, madePar, madeTotalPar } from './builders.js';

const makeCheevos = (set: AchievementSet): void => {
  parData.forEach((data) => {
    set.addAchievement({
      title: data.title,
      description: `Have any player make par or better on hole ${data.hole + 1}.`,
      points: 3,
      conditions: madePar(data.base, data.hole),
    });
  });

  set.addAchievement({
    title: 'No Carnival Games Here',
    points: 5,
    type: 'win_condition',
    description: 'Have any player finish the course with a total score of par or better.',
    conditions: madeTotalPar(),
  });

  set.addAchievement({
    title: 'To The PGA With You',
    points: 10,
    description: 'Have any player finish the course hitting par on each individual hole.',
    conditions: madeAllPar(),
  });
};

export default makeCheevos;
