import { AchievementSet } from '@cruncheevos/core';
import makeCheevos from './cheevos.js';
import makeBoards from './boards.js';
import makeRp from './rp.js';

const set = new AchievementSet({
  gameId: 3673,
  title: `Snow White and the Seven Dwarfs`,
});
makeCheevos(set);
makeBoards(set);
export const rich = makeRp();

export default set;
