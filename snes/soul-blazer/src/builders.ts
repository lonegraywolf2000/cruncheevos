import { define as $, Condition, ConditionBuilder } from '@cruncheevos/core';
import { address } from './data.js';

/**
 * Reset the cheevo if the reset button is hit.
 * @returns the generated lines.
 */
export const resetHitBuilder = () => $().resetIf(['', 'Mem', '16bit', 0x20, '=', 'Value', '', 0]);

/**
 * A simple delta builder for a single address in memory.
 * @param size The measurement to use on the address.
 * @param addr The address in RAM for both operations.
 * @param cmp The comparison operator to use when comparing against deltas.
 * @returns The delta comparison.
 */
export const deltaCmpBuilder = (
  size: Condition.Size,
  addr: number,
  cmp: Condition.OperatorComparison = '>',
): ConditionBuilder => $(['', 'Mem', size, addr, cmp, 'Delta', size, addr]);

/**
 * Compare when one memory address goes from one specifi value to another.
 * @param size The memory size.
 * @param addr The address in RAM.
 * @param prev The value on the previous frame.
 * @param curr The value on the current frame.
 * @returns The appropriate condition string.
 */
export const deltaFromConstantToConstantBuilder = (
  size: Condition.Size,
  addr: number,
  prev: number,
  curr: number,
): ConditionBuilder => {
  return $(['', 'Delta', size, addr, '=', 'Value', '', prev], ['', 'Mem', size, addr, '=', 'Value', '', curr]);
};

/**
 * A partial cheevo builder to see if a value got sent a specific value.
 *
 * In this implementation, we don't care about what the previous value was.
 * @param size The size of the memory we wish to look at.
 * @param addr The address in RAM for both operations.
 * @param value The value to compare against.
 * @returns The delta to zero condition.
 */
export const deltaToConstantBuilder = (size: Condition.Size, addr: number, value: number): ConditionBuilder => {
  return $(['', 'Delta', size, addr, '!=', 'Value', '', value], ['', 'Mem', size, addr, '=', 'Value', '', value]);
};

/**
 * A partial cheevo builder to see if a value got sent to zero.
 * @param size The size of the memory we wish to look at.
 * @param addr The address in RAM for both operations.
 * @returns The delta to zero condition.
 */
export const deltaToZeroBuilder = (size: Condition.Size, addr: number): ConditionBuilder =>
  deltaToConstantBuilder(size, addr, 0);

/**
 * A simple item builder for Soul Blazer.
 *
 * This game has two running values for items: one when the item is highlighted with the cursor & one when not.
 * This function handles both cases.
 * @param addr The address of the item.
 * @param value The number to compare against.
 * @param valueType The value type (usually Mem or Delta here)
 * @returns The focused item condition.
 */
const itemBuilder = (addr: number, value: number, valueType: Condition.ValueType) =>
  $(['AddSource', valueType, '8bit', addr, '&', 'Value', '', 0x7f], ['', 'Value', '', 0, '=', 'Value', '', value]);

/**
 * An item builder that handles deltas.
 * @param addr The address of the item.
 * @param value The value of the item.
 * @returns The generated lines.
 */
export const gotItemBuilder = (addr: number, value: number): ConditionBuilder =>
  $(itemBuilder(addr, 0, 'Delta'), itemBuilder(addr, value, 'Mem'));

/**
 * Is the current lair capable of being sealed?
 * @param addr The address in RAM to seal.
 * @returns The generated lines.
 */
export const sealLairBuilder = (addr: number): ConditionBuilder => $(deltaToZeroBuilder('Lower4', addr));

/**
 * Check if the lair is already sealed: if so, we don't want to activate the cheevo.
 * @param addr The address of the lair in memory.
 * @returns The generated lines.
 */
export const resetIfLairSealedBuilder = (addr: number): ConditionBuilder =>
  $(['ResetIf', 'Mem', 'Bit7', addr, '=', 'Value', '', 1]);

/**
 * Check if the Soul Blazer is damaged at any point. Reset the cheevo if this happens.
 * @returns The generated lines.
 */
export const resetIfDamagedBuilder = (): ConditionBuilder =>
  $().resetIf(['', 'Mem', '8bit', address.curHp, '<', 'Delta', '8bit', address.curHp]);

/**
 * A partial cheevo builder to ensure we are on the correct map.
 * @param map the current map ID (technically message ID to display on pause, but that's semantics).
 * @param lType the value type to work with.
 * @param isReset a condition flag indicating whether this should be set as a ResetIf line.
 * @returns The generated lines.
 */
export const mapBuilder = (
  map: number,
  lType: Condition.ValueType = 'Mem',
  isReset: boolean = false,
): ConditionBuilder => {
  const flag: Condition.Flag = isReset ? 'ResetIf' : '';
  const cmp: Condition.OperatorComparison = isReset ? '!=' : '=';
  return $([flag, lType, '8bit', address.mapId, cmp, 'Value', '', map]);
};

/**
 * A helper function to make it easy to detect a map change.
 * @param prevMap The map on the previous frame.
 * @param currMap The map on the current frame.
 * @returns The cheevo condition.
 */
export const changeMapBuilder = (prevMap: number, currMap: number): ConditionBuilder =>
  $(mapBuilder(prevMap, 'Delta'), mapBuilder(currMap));

/**
 * A partial cheevo builder to verify that the name of a person is set.
 * @param isReset a value indicating whether to have these conditions using ResetIf
 * @returns The generated lines.
 */
export const nameBuilder = (isReset: boolean = false) => {
  const flag: Condition.Flag = isReset ? 'ResetIf' : '';
  const cmp: Condition.OperatorComparison = isReset ? '=' : '!=';
  return $(
    [flag, 'Mem', '8bit', address.nameCheck, cmp, 'Value', '', 0],
    [flag, 'Delta', '8bit', address.nameCheck, cmp, 'Value', '', 0],
  );
};

export const noNameBuilder = () =>
  $(
    ['OrNext', 'Mem', '8bit', address.nameCheck, '=', 'Value', '', 0],
    ['', 'Delta', '8bit', address.nameCheck, '=', 'Value', '', 0],
  );
