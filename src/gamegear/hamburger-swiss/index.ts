import { AchievementSet } from '@cruncheevos/core';
import makeCheevos from './cheevos.js';
import makeRp from './rp.js';

const set = new AchievementSet({
  gameId: 28834,
  title: '~Homebrew~ Hamburgers En Route to Switzerland',
});
makeCheevos(set);

export const rich = makeRp();

export default set;
