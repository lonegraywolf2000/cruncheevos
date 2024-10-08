import { Condition, RichPresence } from '@cruncheevos/core';

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

export const rpMakeLookupLib = (
  name: string,
  size: Condition.Size,
  addr: number,
  obj: Record<number, string | number>,
  fallback: string | undefined = undefined,
  prefix: Condition.ValueType = '',
) => {
  const values: Record<string | number, string> = {};
  if (fallback) {
    values['*'] = fallback;
  }
  for (const key in obj) {
    const tmp = obj[key];
    if (typeof tmp === 'number') {
      values[key] = '' + tmp;
    } else {
      values[key] = tmp;
    }
  }

  const target = `${prefixToRp(prefix)}${memorySizeToRp(size)}${addr.toString(16)}`;

  const data: RichPresence.LookupParams = {
    values,
    name,
    defaultAt: target,
  };

  return data;
};
