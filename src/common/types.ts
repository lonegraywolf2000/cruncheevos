import { ConditionBuilder } from '@cruncheevos/core';

export type Points = 0 | 1 | 2 | 3 | 4 | 5 | 10 | 25 | 50 | 100;

export type RpDisplayCode = [string, ConditionBuilder | undefined];
