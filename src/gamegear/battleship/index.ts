import { AchievementSet } from '@cruncheevos/core';
import makeCheevos from './cheevos.js';
import makeRp from './rp.js';

const set = new AchievementSet({
  gameId: 28803,
  title: 'Battleship: The Classic Naval Combat Game',
});
makeCheevos(set);

export const rich = makeRp();

export default set;
