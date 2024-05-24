import { AchievementSet } from '@cruncheevos/core';

import makeCheevos from './cheevos.js';
import makeRp from './rp.js';

const set = new AchievementSet({ gameId: 1168, title: 'Soul Blazer' });
(async function main() {
  makeCheevos(set);
  // Rich Presence
  if (process.argv.includes('rich')) {
    await makeRp(set).catch(console.log);
  }
})();

export default set;
