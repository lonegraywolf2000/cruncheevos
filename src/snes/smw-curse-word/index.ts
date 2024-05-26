import { AchievementSet } from '@cruncheevos/core';

import makeCheevos from './cheevos.js';
import makeBoards from './boards.js';
import makeRp from './rp.js';

const set = new AchievementSet({ gameId: 29793, title: '~Hack~ slurdgery' });
makeCheevos(set);
makeBoards(set);
await makeRp(set).catch(console.log);

export default set;
