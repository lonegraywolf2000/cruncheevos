import { define as $, AchievementSet, ConditionBuilder } from '@cruncheevos/core';

import { levelLookup, levelsWithExit, moonData } from './data.js';
import {
  activeInLevel,
  activeLevel,
  activeRoom,
  beatLevel,
  deathChallenge,
  kaizoChallenge,
  keyJumpChallenge,
  moonCollected,
} from './builders.js';

const makeCheevos = (set: AchievementSet): void => {
  levelsWithExit.forEach((lvl) => {
    const data = levelLookup[lvl];
    set.addAchievement({
      title: data[2]!,
      points: data[1],
      type: data[1] === 25 ? 'win_condition' : 'progression',
      description: `Clear the level ${data[0]}.`,
      conditions: $(activeLevel(lvl), beatLevel()),
    });
  });

  moonData.forEach((moon) => {
    const data = levelLookup[moon.level];
    let conditions: unknown;
    if (moon.tiles.length == 1) {
      conditions = $(activeLevel(moon.level), activeRoom(moon.room), activeInLevel(), moonCollected(moon.tiles[0]));
    } else {
      conditions = {
        core: $(activeLevel(moon.level), activeRoom(moon.room), activeInLevel()),
        alt1: moonCollected(moon.tiles[0]),
        alt2: moonCollected(moon.tiles[1]),
      };
    }

    set.addAchievement({
      title: moon.title,
      points: moon.points,
      description: `Collect the moon${moon.location ?? ''} in ${data[0]}.`,
      conditions: conditions as ConditionBuilder,
    });
  });

  set.addAchievement({
    title: 'The Modern Bad Time',
    points: 5,
    description: 'Complete the advanced version of Kaizo Klazzics.',
    conditions: $(activeLevel(0x03), activeRoom(0x0c), beatLevel()),
  });

  set.addAchievement({
    title: 'The Key To Success',
    points: 10,
    description: 'In the first room of Key Jump, Vine Carry, do not use the vine.',
    conditions: $(activeLevel(0x51), keyJumpChallenge()),
  });

  set.addAchievement({
    title: "There's (Almost) Always At Least One Of These",
    points: 1,
    description: 'Find the Kaizo Block in Turnblocks N Moles. Well, either one.',
    conditions: $(activeLevel(0x39), activeRoom(0x002b), kaizoChallenge()),
  });

  set.addAchievement({
    title: 'Going The Distance For A Spoiled Egg',
    points: 5,
    description: 'Touch the mega death wall in Yoshi learns colors.',
    conditions: $(activeLevel(0x4a), activeRoom(0x0043), deathChallenge()),
  });
};

export default makeCheevos;
