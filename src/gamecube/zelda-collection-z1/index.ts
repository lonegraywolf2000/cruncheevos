import { AchievementSet } from '@cruncheevos/core';
import makeCheevos from './cheevos.js';
import makeBoards from './boards.js';
import makeRp from './rp.js';

const set = new AchievementSet({
  gameId: 2198,
  title: `Legend of Zelda, The: Collector's Edition`,
});
makeCheevos(set);
makeBoards(set);
export const rich = makeRp();

export default set;
