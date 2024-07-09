import { define as $, Condition, ConditionBuilder } from '@cruncheevos/core';
import { isNumber } from '@cruncheevos/core/util';

const toHexString = (item: string | number): string => {
  if (isNumber(item)) {
    return `0x${item.toString(16)}`;
  }
  return toHexString(Number(item));
};

const memorySizeToRp = (size: Condition.Size): string => {
  switch (size) {
    case 'Bit0':
      return '0xM';
    case 'Bit1':
      return '0xN';
    case 'Bit2':
      return '0xO';
    case 'Bit3':
      return '0xP';
    case 'Bit4':
      return '0xQ';
    case 'Bit5':
      return '0xR';
    case 'Bit6':
      return '0xS';
    case 'Bit7':
      return '0xT';
    case 'Lower4':
      return '0xL';
    case 'Upper4':
      return '0xU';
    case '8bit':
      return '0xH';
    case '24bit':
      return '0xW';
    case '32bit':
      return '0xX';
    case '16bitBE':
      return '0xI';
    case '24bitBE':
      return '0xJ';
    case '32bitBE':
      return '0xG';
    case 'BitCount':
      return '0xK';
    case 'Float':
      return 'fF';
    case 'FloatBE':
      return 'fB';
    case 'MBF32':
      return 'fM';
    case 'MBF32LE':
      return 'fL';
    case 'Double32':
      return 'fH';
    case 'Double32BE':
      return 'fI';
    default:
      return '0x ';
  }
};

const prefixToRp = (prefix: Condition.ValueType): string => {
  switch (prefix) {
    case 'Delta':
      return 'd';
    case 'Prior':
      return 'p';
    case 'BCD':
      return 'b';
    case 'Invert':
      return '~';
    default:
      return '';
  }
};

const reverseLookup = (obj: Record<number, string>): Record<string, number[]> => {
  const target: Record<string, number[]> = {};
  for (const key in obj) {
    if (obj[key] in target) {
      target[obj[key]].push(Number(key));
    } else {
      target[obj[key]] = [Number(key)];
    }
  }
  for (const key in target) {
    target[key].sort((a, b) => (a < b ? -1 : 1));
  }
  return target;
};

/**
 * Generate a text-compatible lookup table for the rich presence.
 * @param name The name of the collection for RP purposes.
 * @param size The size of the eventual key to use.
 * @param obj The collection to convert.
 * @param fallback An optional fallback statement to use if there are no matches.
 * @param prefix An optional prefix to include in the format.
 * @returns The formatted lookup table.
 */
export const rpMakeLookup = (
  name: string,
  size: Condition.Size,
  obj: Record<number, string>,
  fallback: string | undefined = undefined,
  prefix: Condition.ValueType = '',
) => {
  let rich = `Lookup:${name}\n`;
  const reverse = reverseLookup(obj);
  for (const key in reverse) {
    const allNums = reverse[key].join(',');
    rich += `${allNums}=${key}\n`;
  }
  if (fallback) {
    rich += `*=${fallback}\n`;
  }

  return {
    rich,
    point(address: number, offset: number = 0) {
      return `@${name}(${prefixToRp(prefix)}${memorySizeToRp(size)}${(address + offset).toString(16).toUpperCase()})`;
    },
  };
};

type RpLookup = {
  name: string;
  toString: () => string;
  point: (input: number) => string;
  defaultPoint: () => ConditionBuilder;
};

/**
 * Generate rich presence with a more robust setup.
 * @param name The name to use for the RP.
 * @param defaultAddress The memory address for the lookup.
 * @param values The object values to process. Default values must be supplied to this function.
 * @param keyFormat If the key is a number, indicate if it's `dec` for decimal here.
 * @returns The formatted rich presence.
 */
export const makeRichPresenceLookup = (
  name: string,
  defaultAddress: ConditionBuilder,
  values: Record<number | string, string>,
  keyFormat?: string,
): RpLookup => {
  let rich = `Lookup:${name}`;
  for (const inputKey in values) {
    const keyNumber = Number(inputKey);
    const key = Number.isNaN(keyNumber)
      ? inputKey
      : keyFormat === 'dec'
        ? keyNumber
        : toHexString(keyNumber).toLowerCase().padStart(2, '0');

    rich += `\n${key}=${values[inputKey]}`;
  }

  return {
    name,
    toString() {
      return rich;
    },
    point(input) {
      return `@${name}(${input.toString()})`;
    },
    defaultPoint() {
      if (!defaultAddress) {
        throw new Error('default address not set');
      }
      return defaultAddress;
    },
  };
};

/**
 * Generate the display text for the RP.
 * @param args The two parts of a condition builder.
 * @returns The lines of the RP.
 */
export function makeRichPresenceDisplay(...args) {
  const condition = args.length >= 2 ? `?${args[0]}?` : '';
  const value = args.length >= 2 ? args[1] : args[0];

  return condition + value;
}

export const displayValue = (strings: TemplateStringsArray, ...args): string => {
  return strings
    .map((str, i) => {
      let val = i === strings.length - 1 ? '' : args[i];
      if (val.defaultPoint) {
        val = `@${val.name}(${val.defaultPoint()})`;
      }
      return `${str}${val}`;
    })
    .join('');
};

/**
 * Generate a numeric value from RAM into the rich presence format.
 * @param addr The address to turn into a number.
 * @param size The size of the address.
 * @param valueType The value type of the address. Usually `Mem` but other values could be valid.
 * @returns The formatted simple number.
 */
export const rpMakeSimpleNumber = (addr: number, size: Condition.Size, valueType: Condition.ValueType = 'Mem') => {
  const condition = $(['', valueType, size, addr, '=', 'Value', '', 0]).toString();
  return `@Number(${condition.substring(0, condition.length - 2)})`;
};
