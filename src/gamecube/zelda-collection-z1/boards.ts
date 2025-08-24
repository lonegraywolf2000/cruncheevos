import { define as $, AchievementSet } from '@cruncheevos/core';
import {
  beatGame,
  inFirstQuest,
  inLevel,
  inSecondQuest,
  inZelda1,
  isHundredPercentFilled,
  isLowishPercentCompatible,
  loadingMemoryCard,
  newFileStart,
  onScreen,
} from './builders.js';
import { address, dungeonFinishData } from './data.js';
import { simpleCurrCompare, simplePrevCompare } from '../../common/builders.js';

const makeBoards = (set: AchievementSet) => {
  [0, 1].forEach((q) => {
    const quest = q == 0 ? inFirstQuest() : inSecondQuest();
    const ordinal = q == 0 ? '1st' : '2nd';
    const screen = dungeonFinishData[quest.conditions[1].rvalue.value * 9 + 8][3];
    const isDone = $(inLevel(9), onScreen(screen), beatGame());
    set.addLeaderboard({
      title: `${ordinal} Quest - Fewest Deaths Any%`,
      description: `How low can your death count go in ${ordinal} quest?`,
      lowerIsBetter: true,
      type: 'VALUE',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, isDone),
        cancel: '0=1',
        submit: '1=1',
        value: $(
          ['AddAddress', 'Mem', '8bit', address.saveSlot],
          ['AddSource', 'Mem', '8bit', address.deathCount],
          'M:0=1',
        ),
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Fewest Deaths Low-ish%`,
      description: `How low can your death count go in ${ordinal} quest without using the best items?`,
      lowerIsBetter: true,
      type: 'VALUE',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, isLowishPercentCompatible(), isDone),
        cancel: '0=1',
        submit: '1=1',
        value: $(
          ['AddAddress', 'Mem', '8bit', address.saveSlot],
          ['AddSource', 'Mem', '8bit', address.deathCount],
          'M:0=1',
        ),
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Fewest Deaths Max%`,
      description: `How low can your death count go in ${ordinal} quest with all items?`,
      lowerIsBetter: true,
      type: 'VALUE',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, isHundredPercentFilled(), isDone),
        cancel: '0=1',
        submit: '1=1',
        value: $(
          ['AddAddress', 'Mem', '8bit', address.saveSlot],
          ['AddSource', 'Mem', '8bit', address.deathCount],
          'M:0=1',
        ),
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Any% No Restrictions`,
      description: `Get the fastest time in the ${ordinal} quest`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, newFileStart()),
        cancel: {
          core: '1=1',
          alt1: inZelda1().withLast({ cmp: '!=' }),
          alt2: $(
            simplePrevCompare('8bit', address.gameState, 1, '>'),
            simpleCurrCompare('8bit', address.gameState, 1, '<='),
          ),
        },
        submit: isDone,
        value: 'M:1=1',
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Any% Deathless & No Menu Warp`,
      description: `Get the fastest time in the ${ordinal} quest with no deaths or menu warps`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, newFileStart()),
        cancel: {
          core: '1=1',
          alt1: inZelda1().withLast({ cmp: '!=' }),
          alt2: $(
            simplePrevCompare('8bit', address.gameState, 1, '>'),
            simpleCurrCompare('8bit', address.gameState, 1, '<='),
          ),
          alt3: $(
            simplePrevCompare('8bit', address.gameState, 8, '!='),
            simpleCurrCompare('8bit', address.gameState, 8),
          ),
          alt4: $(
            ['AddSource', 'Delta', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
            ['', 'Value', '', 0, '!=', 'Value', '', 0],
            ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
            ['', 'Value', '', 0, '=', 'Value', '', 0],
          ),
        },
        submit: isDone,
        value: 'M:1=1',
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Lowish% No Restrictions`,
      description: `Get the fastest time in the ${ordinal} quest without the most powerful items`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, newFileStart()),
        cancel: {
          core: '1=1',
          alt1: inZelda1().withLast({ cmp: '!=' }),
          alt2: $(
            simplePrevCompare('8bit', address.gameState, 1, '>'),
            simpleCurrCompare('8bit', address.gameState, 1, '<='),
          ),
          alt3: simpleCurrCompare('8bit', address.sword, 3),
          alt4: simpleCurrCompare('8bit', address.ring, 2),
          alt5: simpleCurrCompare('Upper4', address.hearts, 8, '>='),
        },
        submit: isDone,
        value: 'M:1=1',
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Lowish% Deathless & No Menu Warp`,
      description: `Get the fastest time in the ${ordinal} quest with no deaths, menu warps, or powerful items`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, newFileStart()),
        cancel: {
          core: '1=1',
          alt1: inZelda1().withLast({ cmp: '!=' }),
          alt2: $(
            simplePrevCompare('8bit', address.gameState, 1, '>'),
            simpleCurrCompare('8bit', address.gameState, 1, '<='),
          ),
          alt3: simpleCurrCompare('8bit', address.sword, 3),
          alt4: simpleCurrCompare('8bit', address.ring, 2),
          alt5: simpleCurrCompare('Upper4', address.hearts, 8, '>='),
          alt6: $(
            simplePrevCompare('8bit', address.gameState, 8, '!='),
            simpleCurrCompare('8bit', address.gameState, 8),
          ),
          alt7: $(
            ['AddSource', 'Delta', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
            ['', 'Value', '', 0, '!=', 'Value', '', 0],
            ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
            ['', 'Value', '', 0, '=', 'Value', '', 0],
          ),
        },
        submit: isDone,
        value: 'M:1=1',
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Max% No Restrictions`,
      description: `Get the fastest time in the ${ordinal} quest with all relevant items`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, newFileStart()),
        cancel: {
          core: '1=1',
          alt1: inZelda1().withLast({ cmp: '!=' }),
          alt2: $(
            simplePrevCompare('8bit', address.gameState, 1, '>'),
            simpleCurrCompare('8bit', address.gameState, 1, '<='),
          ),
          alt3: isHundredPercentFilled().withLast({ cmp: '<' }),
        },
        submit: $(isDone, isHundredPercentFilled()),
        value: 'M:1=1',
      },
    });

    set.addLeaderboard({
      title: `${ordinal} Quest - Max% Deathless & No Menu Warp`,
      description: `Get the fastest time in the ${ordinal} quest with all relevant items alongside no deaths or menu warps`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: $(inZelda1(), loadingMemoryCard().withLast({ cmp: '!=' }), quest, newFileStart()),
        cancel: {
          core: '1=1',
          alt1: inZelda1().withLast({ cmp: '!=' }),
          alt2: $(
            simplePrevCompare('8bit', address.gameState, 1, '>'),
            simpleCurrCompare('8bit', address.gameState, 1, '<='),
          ),
          alt3: isHundredPercentFilled().withLast({ cmp: '<' }),
          alt4: $(
            simplePrevCompare('8bit', address.gameState, 8, '!='),
            simpleCurrCompare('8bit', address.gameState, 8),
          ),
          alt5: $(
            ['AddSource', 'Delta', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
            ['', 'Value', '', 0, '!=', 'Value', '', 0],
            ['AddSource', 'Mem', '16bitBE', address.hearts, '&', 'Value', '', 0x0fff],
            ['', 'Value', '', 0, '=', 'Value', '', 0],
          ),
        },
        submit: $(isDone, isHundredPercentFilled()),
        value: 'M:1=1',
      },
    });
  });
};

export default makeBoards;
