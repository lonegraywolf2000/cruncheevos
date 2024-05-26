import { AchievementSet } from '@cruncheevos/core';
import { boxCheevo, holeInOneCheevo, parCheevo, powerBarCheevo, sandTrapCheevo } from './builders.js';

const makeCheevos = (set: AchievementSet): void => {
  [...Array(9)].forEach((_, i) => {
    set.addAchievement({
      title: `No Bogeys Here ${i + 1}`,
      type: 'progression',
      points: 5,
      description: `Get a Par or better in hole ${i + 1}.`,
      conditions: parCheevo(i),
    });
  });

  set.addAchievement({
    title: 'Excellent Long Game',
    description: 'Hit the ball with max power.',
    points: 10,
    conditions: powerBarCheevo(),
  });

  set.addAchievement({
    title: `Anakin's Disgrace`,
    description: 'Hit the ball in a bunker (sand trap). Then save par.',
    points: 10,
    conditions: sandTrapCheevo(),
  });

  set.addAchievement({
    title: 'Thinking Inside The Box',
    description: 'Play an entire round without ever hitting the ball out of bounds.',
    points: 25,
    conditions: boxCheevo(),
  });

  set.addAchievement({
    title: 'Are You A Professional Golfer?',
    description: 'Get a hole in one.',
    points: 25,
    conditions: holeInOneCheevo(),
  });
};

export default makeCheevos;
