import { define as $, AchievementSet, andNext, once, resetIf, trigger } from '@cruncheevos/core';

import { simpleDeltaCmp } from '../../common/builders.js';

import { beatLevelData, cheevoLevels, levelDeathData, levelLookup, levelSmallData, smallCheevoLevels } from './data.js';
import { activeLevel, beatLevel, deathCount, isPoweredUp, loadLevel, notBeatenYet, outOfLevel } from './builders.js';

const makeCheevos = (set: AchievementSet): void => {
  cheevoLevels.forEach((lvl) => {
    const data = beatLevelData[lvl];
    set.addAchievement({
      title: data[0],
      type: lvl !== 12 ? 'progression' : 'win_condition',
      points: data[1],
      description: `Clear the level [${levelLookup[lvl]}].`,
      conditions: $(activeLevel(lvl), notBeatenYet(), beatLevel()),
    });
  });

  smallCheevoLevels.forEach((lvl) => {
    const data = levelSmallData[lvl];
    set.addAchievement({
      title: data[0],
      points: data[1],
      description: `Clear the level [${levelLookup[lvl]}] without ever using a power-up. Deaths are allowed.`,
      conditions: $(once(andNext(loadLevel(lvl))), resetIf(outOfLevel()), resetIf(isPoweredUp()), trigger(beatLevel())),
    });
  });

  cheevoLevels.forEach((lvl) => {
    const data = levelDeathData[lvl];
    set.addAchievement({
      title: data[0],
      points: data[1],
      description: `Clear the level [${levelLookup[lvl]}] before ${data[2]} deaths take place.`,
      conditions: $(
        once(andNext(loadLevel(lvl))),
        resetIf(outOfLevel()),
        resetIf(deathCount(data[2])),
        trigger(beatLevel()),
      ),
    });
  });

  set.addAchievement({
    title: 'Figures This Appears Somehow',
    description: 'Collect the only 3-up moon in the game.',
    points: 5,
    conditions: $(activeLevel(8), simpleDeltaCmp('Bit7', 0x1fef, '>')),
  });
};

export default makeCheevos;
