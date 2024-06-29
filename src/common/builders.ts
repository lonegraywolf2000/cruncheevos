import { define as $, Condition, ConditionBuilder } from '@cruncheevos/core';

const simpleCmpOneConstant = (
  size: Condition.Size,
  addr: number,
  target: number,
  cmp: Condition.OperatorComparison,
  valueType: Condition.ValueType,
) => $(['', valueType, size, addr, cmp, 'Value', '', target]);

/**
 * Compare a memory address's prior value against a static value, and make decisions from there.
 * @param size The size of the address being looked at.
 * @param addr The address in RAM.
 * @param target The value to compare against.
 * @param cmp The comparison to use.
 * @returns The appropriate condition.
 */
export const simplePriorCompare = (
  size: Condition.Size,
  addr: number,
  target: number,
  cmp: Condition.OperatorComparison = '<',
) => simpleCmpOneConstant(size, addr, target, cmp, 'Prior');

/**
 * Compare a memory address's previous frame against a static value, and make decisions from there.
 * @param size The size of the address being looked at.
 * @param addr The address in RAM.
 * @param target The value to compare against.
 * @param cmp The comparison to use.
 * @returns The appropriate condition.
 */
export const simplePrevCompare = (
  size: Condition.Size,
  addr: number,
  target: number,
  cmp: Condition.OperatorComparison = '<',
) => simpleCmpOneConstant(size, addr, target, cmp, 'Delta');

/**
 * Compare a memory address against a static value, and make decisions from there.
 * @param size The size of the address being looked at.
 * @param addr The address in RAM.
 * @param target The value to compare against.
 * @param cmp The comparison to use.
 * @returns The appropriate condition.
 */
export const simpleCurrCompare = (
  size: Condition.Size,
  addr: number,
  target: number,
  cmp: Condition.OperatorComparison = '=',
) => simpleCmpOneConstant(size, addr, target, cmp, 'Mem');

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
export const simpleCurrPrevCmp = (
  size: Condition.Size,
  addr: number,
  cmp: Condition.OperatorComparison = '>',
): ConditionBuilder => $(['', 'Mem', size, addr, cmp, 'Delta', size, addr]);

/**
 * An easier way to compose a total across multiple bytes.
 * @param size The measurement to use on the address.
 * @param addr The address in RAM for the operation.
 * @param factor How much to multiply the value by.
 * @param valueType The specific point in time to capture the value.
 * @returns The add source comparison.
 */
export const addSourceMultiple = (
  size: Condition.Size,
  addr: number,
  factor: number,
  valueType: Condition.ValueType = 'Mem',
) => $(['AddSource', valueType, size, addr, '*', 'Value', '', factor]);
