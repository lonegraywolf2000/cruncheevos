import { define as $, Condition, ConditionBuilder } from '@cruncheevos/core';

/**
 * Compare a memory address against a static value, and make decisions from there.
 * @param size The size of the address being looked at.
 * @param addr The address in RAM.
 * @param target The value to compare against.
 * @param cmp The comparison to use.
 * @returns The appropriate condition.
 */
export const simpleCmpOneConstant = (
  size: Condition.Size,
  addr: number,
  target: number,
  cmp: Condition.OperatorComparison = '=',
) => $(['', 'Mem', size, addr, cmp, 'Value', '', target]);

/**
 * Compare when one memory address goes from one specific value to another.
 * @param size The memory size.
 * @param addr The address in RAM.
 * @param prev The value on the previous frame.
 * @param curr The value on the current frame.
 * @param valueType Provide the option to change delta to Prior if need be. Incompatible with others.
 * @returns The appropriate condition string.
 */
export const simpleCmpTwoConstants = (
  size: Condition.Size,
  addr: number,
  prev: number,
  curr: number,
  valueType: Condition.ValueType = 'Delta',
): ConditionBuilder => {
  return $(['', valueType, size, addr, '=', 'Value', '', prev], ['', 'Mem', size, addr, '=', 'Value', '', curr]);
};

/**
 * A simple delta builder for a single address in memory.
 * @param size The measurement to use on the address.
 * @param addr The address in RAM for both operations.
 * @param cmp The comparison operator to use when comparing against deltas.
 * @returns The delta comparison.
 */
export const simpleDeltaCmp = (
  size: Condition.Size,
  addr: number,
  cmp: Condition.OperatorComparison = '>',
): ConditionBuilder => $(['', 'Mem', size, addr, cmp, 'Delta', size, addr]);
