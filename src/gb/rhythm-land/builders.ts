import * as commonBuilders from '../../common/builders.js';
import { address } from './data.js';

export const onResultScreen = () => commonBuilders.simpleCmpOneConstant('8bit', address.screenId, 8);

export const playingGame = () => commonBuilders.simpleCmpOneConstant('8bit', address.screenId, 3, '<=');

export const inGameMisc = () => commonBuilders.simpleCmpOneConstant('8bit', address.screenId, 8, '<');

export const onResultScreenFromGame = (prior: number) =>
  commonBuilders.simpleCmpTwoConstants('8bit', address.screenId, 8, prior, 'Prior');

export const earnedGrade = (grade: number) =>
  commonBuilders.simpleCmpOneConstant('8bit', address.earnedGrade, grade, '>=');

export const revealGrade = () => commonBuilders.simpleCmpTwoConstants('8bit', address.gradeReveal, 0, 1);
