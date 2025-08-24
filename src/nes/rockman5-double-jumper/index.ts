import { AchievementSet } from '@cruncheevos/core';
import makeCheevos from './cheevos.js';
import makeBoards from './boards.js';
import makeRp from './rp.js';

const set = new AchievementSet({
  gameId: 29752,
  title: '~Hack~ Rockman 5: Double Jumper',
});
makeCheevos(set);
makeBoards(set);
export const rich = makeRp();

export default set;
