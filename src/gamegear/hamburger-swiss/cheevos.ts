import { AchievementSet, andNext, define, once, resetIf, trigger } from '@cruncheevos/core';

import { simpleCurrCompare, simpleCurrPrevCmp, simplePrevCompare } from '../../common/builders.js';

import { address, challengeData, levelLookup, progressionData } from './data.js';
import { currTotalScore, prevTotalScore } from './builders.js';

const makeCheevos = (set: AchievementSet): void => {
  progressionData.forEach((data) => {
    set.addAchievement({
      title: data[1],
      type: data[3],
      points: data[2],
      description: `Take out the milkshakes invading the ${levelLookup[data[0]]}.`,
      conditions: define(
        simpleCurrCompare('8bit', address.currentLevel, data[0]),
        simplePrevCompare('8bit', address.levelScore, 99, '='),
        simpleCurrCompare('8bit', address.levelScore, 99, '>'),
        prevTotalScore(data[0] * 100),
        currTotalScore(data[0] * 100),
      ),
    });
  });

  challengeData.forEach((data) => {
    const lvl = data[0] + 1;
    set.addAchievement({
      title: `Dodging In The ${levelLookup[lvl]}`,
      points: data[1],
      description: `Clear the ${levelLookup[lvl]} without losing a life.`,
      conditions: define(
        resetIf(simpleCurrPrevCmp('8bit', address.lives, '<')),
        resetIf(simpleCurrCompare('8bit', address.currentLevel, lvl, '!=')),
        once(
          andNext(
            simplePrevCompare('8bit', address.currentLevel, lvl),
            simpleCurrCompare('8bit', address.currentLevel, lvl),
          ),
        ),
        trigger('hits 100', simpleCurrPrevCmp('8bit', address.levelScore, '>')),
      ),
    });
  });

  // full game damageless has its own standalone cheevo.
  set.addAchievement({
    title: 'Schweizerpsalm',
    points: 10,
    description: 'Complete the journey without losing any lives.',
    conditions: define(
      once(
        andNext(
          simplePrevCompare('16bit', address.gameState, 0x6485, '!='),
          simpleCurrCompare('16bit', address.gameState, 0x6485),
        ),
      ),
      resetIf(simpleCurrPrevCmp('8bit', address.lives, '<')),
      trigger(currTotalScore(700)),
    ),
  });

  challengeData.forEach((data) => {
    const lvl = data[0] + 1;
    const points = data[1] >= 5 ? data[1] : 5;
    set.addAchievement({
      title: `[VOID] Accurate In The ${levelLookup[lvl]}`,
      points,
      description: `Clear the ${levelLookup[lvl]} without missing a shot. Deaths are allowed.`,
      conditions: define(
        resetIf(simpleCurrCompare('8bit', address.currentLevel, lvl, '!=')),
        resetIf(
          andNext(
            simpleCurrPrevCmp('8bit', address.firedWeapon, '<'),
            simpleCurrPrevCmp('8bit', address.levelScore, '='),
          ),
        ),
        once(
          andNext(
            simplePrevCompare('8bit', address.currentLevel, data[0], '='),
            simpleCurrCompare('8bit', address.currentLevel, lvl),
          ),
        ),
        trigger(simpleCurrCompare('8bit', address.levelScore, 99, '>')),
      ),
    });
  });
};

export default makeCheevos;
