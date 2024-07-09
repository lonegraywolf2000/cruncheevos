import { AchievementSet } from '@cruncheevos/core';

import makeBoards from './boards.js';
import makeCheevos from './cheevos.js';
import makeRp from './rp.js';

const set = new AchievementSet({ gameId: 29923, title: '~Hack~ 2Kaizo2Learn' });
makeCheevos(set);
makeBoards(set);
await makeRp(set).catch(console.log);

export default set;
