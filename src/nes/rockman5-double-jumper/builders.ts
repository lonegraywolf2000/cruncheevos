import { define as $, andNext, Condition } from '@cruncheevos/core';

import {
  simpleCmpTwoConstants,
  simpleCurrCompare,
  simpleCurrPrevCmp,
  simplePrevCompare,
} from '../../common/builders.js';

import { address } from './data.js';

export const alwaysOnDashMode = () => simpleCurrCompare('8bit', address.dashModePermanent, 1);

export const alwaysOffDashMode = () => alwaysOnDashMode().withLast({ rvalue: { value: 0 } });

export const pickedUpDashCan = () => simpleCurrPrevCmp('8bit', address.dashModeTemporary);

/**
 * Are we starting from the beginning?
 * @returns true if we're starting on a fresh game.
 */
export const freshGame = () =>
  $(
    simpleCurrCompare('32bit', 0x7f11, 0),
    simpleCurrCompare('32bit', 0x7f15, 0),
    simpleCurrCompare('32bit', 0x7f19, 0),
    simpleCurrCompare('32bit', 0x7f21, 0),
  );

export const startRobotMaster = () => simpleCmpTwoConstants('8bit', address.musicId, 0x0d, 0x0e);

export const inStage = (stage: number) => simpleCurrCompare('8bit', address.currentStage, stage);

/**
 * Are we on the matching area/screen?
 * @param area The current area/screen.
 * @returns true if we match.
 */
export const onArea = (area: number, type: Condition.ValueTypeSized = 'Mem') =>
  $(
    ['AddSource', type, 'Bit4', address.currentArea, '*', 'Value', '', 16],
    ['', type, 'Lower4', address.currentArea, '=', 'Value', '', area],
  );

export const playerHealth = (target: number) =>
  $(
    ['AddSource', 'Mem', 'Bit4', address.playerHealth, '*', 'Value', '', 16],
    ['', 'Mem', 'Lower4', address.playerHealth, '=', 'Value', '', target],
  );

const robotMasterToBit: Record<number, Condition.Size> = {
  0: 'Bit0',
  1: 'Bit1',
  2: 'Bit2',
  3: 'Bit3',
  4: 'Bit4',
  5: 'Bit5',
  6: 'Bit6',
  7: 'Bit7',
};

export const rmStageLbStart = (stage: number) =>
  $(
    inStage(stage),
    onArea(0),
    stage < 8 && ['', 'Mem', robotMasterToBit[stage], 0x6e, '=', 'Value', '', 0],
    simpleCmpTwoConstants('8bit', address.animationId, 8, 0),
  );

/**
 * Was a special item picked up?
 * @param stage The stage with the item.
 * @param area The area/screen within the stage.
 * @param addr The address containing the item.
 * @returns the condition in question.
 */
export const specialGet = (stage: number, area: number, addr: number) =>
  $(inStage(stage), onArea(area), simplePrevCompare('8bit', addr, 0, '='), simpleCurrCompare('8bit', addr, 0, '!='));

export const beatGame = () =>
  $(simplePrevCompare('8bit', address.musicId, 0x15, '!='), simpleCurrCompare('8bit', address.musicId, 0x15));

/**
 * Did we beat the stage?
 * @param stage The current stage number.
 * @returns The trigger for when a stage is considered beaten.
 */
export const beatStage = (stage: number) =>
  $(
    stage < 15 &&
      $(simplePrevCompare('8bit', address.musicId, 0x11, '!='), simpleCurrCompare('8bit', address.musicId, 0x11)),
    stage == 15 && beatGame(),
  );

export const exitUnit = () => simpleCurrCompare('8bit', address.musicId, 0x13);

export const gameOver = () => simpleCmpTwoConstants('8bit', address.lifeCount, 0, 2);

export const fightingBoss = () => simpleCurrCompare('8bit', address.bossBar, 0x80);

export const usedDoubleJump = () => simpleCurrPrevCmp('8bit', 0xa3, '<');

export const usedRmWeapon = () =>
  $(
    simpleCurrCompare('8bit', address.equippedWeapon, 9, '<=')
      .andNext(simpleCurrCompare('8bit', address.equippedWeapon, 5, '!='))
      .andNext(simpleCurrCompare('8bit', address.equippedWeapon, 0, '!='))
      .andNext(
        $(['AddAddress', 'Mem', '8bit', address.equippedWeapon], simpleCurrPrevCmp('8bit', address.playerHealth, '<')),
      ),
  );

export const usedRmWeaponOrTool = () =>
  andNext(
    simpleCurrCompare('8bit', address.equippedWeapon, 0, '!='),
    $(['AddAddress', 'Mem', '8bit', address.equippedWeapon], simpleCurrPrevCmp('8bit', address.playerHealth, '<')),
  );
export const getWeapon = () => false;
