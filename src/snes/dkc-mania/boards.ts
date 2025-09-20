import { define as $, AchievementSet, ConditionBuilder, orNext } from '@cruncheevos/core';
import { address, leaderboardData, leaderboardKongData } from './data.js';
import { simpleCurrCompare, simplePrevCompare } from '../../common/builders.js';
import { inStage, inStageFromMap, isSinglePlayer, usedEarlyExit, usedSplitUpGlitch } from './builders.js';

type CancelCondition = {
  core: string,
  alt1: ConditionBuilder,
  alt2: ConditionBuilder,
  alt3?: ConditionBuilder
}

const makeBoards = (set: AchievementSet) => {
  leaderboardData.forEach((l) => {
    leaderboardKongData.forEach((k, index) => {
      const cancel: CancelCondition = {
        core: '1=1',
        alt1: usedEarlyExit(),
        alt2: usedSplitUpGlitch()
      };
      if (l.illegalWarps) {
        cancel.alt3 = $(
          simplePrevCompare('8bit', address.roomId, l.illegalWarps.from, '='),
          orNext(
            ...l.illegalWarps.to.map((t) => simpleCurrCompare('8bit', address.roomId, t))
          )
        )
      }

      set.addLeaderboard({
        title: `${l.stageTitle} RTA - ${k.who} Start`,
        description: 'Clear the stage as fast as you can!',
        lowerIsBetter: true,
        type: 'FRAMES',
        id: l.ids[index],
        conditions: {
          start: $(
            isSinglePlayer(),
            inStage(l.roomId),
            inStageFromMap(l.roomId),
            simpleCurrCompare('8bit', address.kongWorldState, 0x00, '='),
            simplePrevCompare('8bit', address.kongWorldState, 0x01, '='),
            simpleCurrCompare('Bit0', address.gameState, k.hasBothKongs ? 1 : 0),
            simpleCurrCompare('8bit', address.currentKong, k.controllingKong),
          ),
          cancel,
          submit: $(
            simpleCurrCompare('8bit', address.kongWorldState, 0x01, '='),
            simplePrevCompare('8bit', address.kongWorldState, 0x00, '='),
          ),
          value: 'M:1=1'
        }
      })
    });
  });
};

export default makeBoards;
