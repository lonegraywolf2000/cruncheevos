import { AchievementSet } from '@cruncheevos/core';
import makeCheevos from './cheevos.js';
import makeRp from './rp.js';

const set = new AchievementSet({
  gameId: 29886,
  title: '~Homebrew~ Tiny Golf',
});
makeCheevos(set);
makeRp(set);

export default set;
