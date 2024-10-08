import { define as $, andNext, measured, measuredIf, orNext, pauseIf, resetIf } from '@cruncheevos/core';
import {
  simpleCmpTwoConstants,
  simpleCurrCompare,
  simplePrevCompare,
  simplePriorCompare,
} from '../../common/builders.js';
import { address, secretBonusPointLookup } from './data.js';
import { simpleDeltaToConstant } from '../../snes/soul-blazer/builders.js';

/**
 * Are we in the menus?
 * @returns true if we're effectively in menus.
 */
export const inMenus = () => simpleCurrCompare('8bit', address.programState, 0x18, '<');

export const inDemos = () => simpleCurrCompare('8bit', address.programState, 0x20, '>');

export const loadingScene = () => simpleCurrCompare('8bit', address.programState, 0x1c);

export const inGameplay = () => simpleCurrCompare('8bit', address.programState, 0x20);

export const inHardMode = () => simpleCurrCompare('8bit', address.hardMode, 1);

export const playingBasketball = () => simpleCurrCompare('8bit', address.currentStage, 0x44);

export const isGameOver = () => simpleCurrCompare('8bit', address.currentStage, 0x3a);

export const sceneStart = () => simpleCmpTwoConstants('8bit', address.curtainState, 0x0c, 0x00);

export const isAlive = () => simpleCurrCompare('8bit', address.headdyHealth, 0, '!=');

export const darkDemonDefeated = () =>
  $(
    simplePrevCompare('8bit', address.darkDemonHealth, 65, '<='),
    simplePrevCompare('8bit', address.darkDemonHealth, 64, '>='),
    simpleCurrCompare('8bit', address.darkDemonHealth, 63, '<='),
    simpleCurrCompare('8bit', address.darkDemonHealth, 62, '>='),
  );

export const actClear = (act: number) =>
  $(isAlive(), act < 9 && simpleDeltaToConstant('16bit', address.musicId, 0x336d), act == 9 && darkDemonDefeated());

export const inStage = (scene: number) => simpleCurrCompare('8bit', address.currentStage, scene);

const inAct = (act: number) => {
  switch (act) {
    case 1:
      return measuredIf(inStage(0x00));
    case 2:
      return $(
        measuredIf(
          orNext(
            andNext(simplePriorCompare('8bit', address.currentStage, 0x02, '='), playingBasketball()),
            inStage(0x0c),
            inStage(0x02),
            inStage(0x06),
          ),
        ),
      );
    case 3:
      return measuredIf(
        orNext(
          andNext(simplePriorCompare('8bit', address.currentStage, 0x32, '='), playingBasketball()),
          inStage(0x10),
          inStage(0x12),
          inStage(0x32),
          inStage(0x14),
        ),
      );
    case 4:
      return measuredIf(
        orNext(
          andNext(simplePriorCompare('8bit', address.currentStage, 0x16, '='), playingBasketball()),
          inStage(0x04),
          inStage(0x16),
          inStage(0x38),
          inStage(0x34),
        ),
      );
    case 5:
      return measuredIf(
        orNext(
          andNext(simplePriorCompare('8bit', address.currentStage, 0x36, '='), playingBasketball()),
          inStage(0x36),
          inStage(0x1a),
          inStage(0x1c),
          inStage(0x1e),
        ),
      );
    case 6:
      return measuredIf(orNext(inStage(0x50), inStage(0x52), inStage(0x54), inStage(0x56)));
    case 7:
      return measuredIf(
        orNext(
          andNext(simplePriorCompare('8bit', address.currentStage, 0x20, '='), playingBasketball()),
          inStage(0x20),
        ),
      );
    case 8:
      return measuredIf(
        orNext(
          andNext(simplePriorCompare('8bit', address.currentStage, 0x26, '='), playingBasketball()),
          inStage(0x22),
          inStage(0x24),
          inStage(0x26),
          inStage(0x28),
          inStage(0x2a),
        ),
      );
    case 9:
      return measuredIf(orNext(inStage(0x2c), inStage(0x2e), inStage(0x30)));
    default:
      return false;
  }
};

export const secretBonusPointTotal = (act: number) => {
  const points = secretBonusPointLookup[act];
  const target = measured(simpleCurrCompare('8bit', address.secretBonusPointsFound, points, act === 3 ? '>=' : '='));
  const sanity = act < 9 && simpleCurrCompare('8bit', 0xe9fe + act * 2, points, act === 3 ? '>=' : '=');

  return $(inAct(act), target, sanity, actClear(act));
};

/**
 * Was level select used to skip ahead in the game?
 *
 * Skipping the opening is fine.
 */
export const preventLevelSelect = () => {
  return pauseIf(
    andNext(
      inStage(0x00).withLast({ cmp: '!=' }),
      inStage(0x3c).withLast({ cmp: '!=' }),
      ['', 'Mem', '16bit', 0xe8fa, '=', 'Value', '', 0, 1],
    ),
  );
};

export const gameOver = () => {
  return resetIf(andNext(simplePrevCompare('8bit', address.programState, 0x18, '>='), inMenus()));
};
