import { define as $, Condition } from '@cruncheevos/core';

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
    point(address: number) {
      return `@${name}(${prefixToRp(prefix)}${memorySizeToRp(size)}${address.toString(16).toUpperCase()})`;
    },
  };
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
