import { AchievementSet } from '@cruncheevos/core';

import makeCheevos from './cheevos.js';
import makeRp from './rp.js';

const set = new AchievementSet({ gameId: 25785, title: '~Homebrew~ Rhythm Land' });
makeCheevos(set);
await makeRp(set).catch(console.log);

export default set;
