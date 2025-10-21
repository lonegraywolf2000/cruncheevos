import { define as $, AchievementSet, andNext, measured, measuredIf, measuredPercent, once, pauseIf, resetIf, trigger } from "@cruncheevos/core";
import { address, challengeDescLookup, challengeSetLookup, challengeSongLookup, challengeTitleLookup, chartClearData, demo, song, songDisplayNames, uniqueSongData, unlockData } from "./data.js";
import { alwaysFalse, plusOne, simpleCmpTwoConstants, simpleCurrCompare, simpleCurrPrevCmp, simplePrevCompare } from "../../common/builders.js";
import { inChallengeMode, inEvaluationScreen, inHereWeGo, isGradeForSongMet, isPlayer1Active, isPlayer1Failed, isPlayer1Maniac, isPlayer2Active, isPlayer2Failed, isPlayer2Maniac, isSong, pauseIfMashingDPad } from "./builders.js";

const makeCheevos = (set: AchievementSet) => {
  // unlock cheevos
  unlockData.forEach((u, i) => {
    const prog = (i == 1 || i == 19) ? undefined : 'progression';
    const songCount = i * 5 + 5;
    set.addAchievement({
      id: u.id,
      type: prog,
      title: u.title,
      points: 2,
      description: `Unlock ${u.thing} by clearing ${songCount} songs.`,
      conditions: {
        core: $(
          simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
          inHereWeGo().withLast({ cmp: '>=' }),
          inEvaluationScreen().withLast({ cmp: '<=' })
        ),
        alt1: $(
          measuredIf(inHereWeGo().withLast({ cmp: '>=' })),
          measuredIf(inEvaluationScreen().withLast({ cmp: '<=' })),
          simplePrevCompare('8bit', address.totalSongsCleared, songCount - 1, '='),
          measured(simpleCurrCompare('8bit', address.totalSongsCleared, songCount))
        ),
        alt2: $(
          simpleCurrPrevCmp(u.size, u.addr),
        )
      }
    });
  });

  // Unique song clear cheevos 
  uniqueSongData.forEach((u, i) => {
    const baseGradeAddress = 0xe4eb6;
    const target = u.target;
    set.addAchievement({
      id: 352710 + i,
      title: `${u.prefix} of a Fourth`,
      points: u.points,
      type: 'progression',
      description: `Clear ${target} unique songs with a B grade or better.`,
      conditions: $(
        simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
        resetIf(inHereWeGo().withLast({ cmp: '<' })),
        resetIf(inEvaluationScreen().withLast({ cmp: '>' })),
        ...Object.keys(song).flatMap((_, s) => isGradeForSongMet(baseGradeAddress + (0x58 * s), 'Delta')),
        alwaysFalse().withLast({ hits: target - 1 }),
        ...Object.keys(song).flatMap((_, s) => isGradeForSongMet(baseGradeAddress + (0x58 * s), 'Mem')),
        measuredPercent(alwaysFalse().withLast({ hits: target })),
        ...Object.keys(song).flatMap((_, s) => isGradeForSongMet(baseGradeAddress + (0x58 * s), 'Delta')),
        pauseIf(alwaysFalse().withLast({ hits: target }),),
        pauseIfMashingDPad(),
      ),
    });
  });

  // song cheevos for most songs
  chartClearData.forEach((c) => {
    const songId = song[c.songKey];
    const demoId = demo[c.songKey];
    const songTitle = songDisplayNames[c.songKey];
    set.addAchievement({
      title: `${c.baseTitle} - Single Maniac`,
      id: c.singleManiacId,
      points: 3,
      description: `Clear ${songTitle} on Single Maniac difficulty with no Little mod or Versus play.`,
      conditions: {
        core: $(
          simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
          simpleCurrCompare('Lower4', address.gameDiff, 3, '>='),
          simpleCmpTwoConstants('8bit', address.songId, demoId, songId, 'Prior'),
          simpleCurrPrevCmp('8bit', address.totalSongsCleared, '!='),
          simpleCurrCompare('Lower4', address.playerStyle, 2, '<'),
        ), // Maybe do the player indexing thing later?
        alt1: $(
          isPlayer1Active(),
          isPlayer2Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p1Little, 0),
          isPlayer1Maniac(),
          isPlayer1Failed().withLast({ rvalue: { value: 0 } })
        ),
        alt2: $(
          isPlayer2Active(),
          isPlayer1Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p2Little, 0),
          isPlayer2Maniac(),
          isPlayer2Failed().withLast({ rvalue: { value: 0 } })
        )
      }
    });

    set.addAchievement({
      title: `${c.baseTitle} - Single FC`,
      id: c.singleComboId,
      points: 5,
      description: `Get a Full Combo on ${songTitle} Single with no Little mod or Versus play.`,
      conditions: {
        core: $(
          simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
          simpleCurrCompare('Lower4', address.gameDiff, 3, '>='),
          simpleCmpTwoConstants('8bit', address.songId, demoId, songId, 'Prior'),
          simpleCurrCompare('Lower4', address.style, 1),
          trigger(simpleCurrPrevCmp('8bit', address.totalSongsCleared, '!=')),
        ),
        alt1: $(
          isPlayer1Active(),
          isPlayer2Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p1Little, 0),
          isPlayer1Failed().withLast({ rvalue: { value: 0 } }),
          simpleCurrCompare('16bit', address.p1Good, 0),
          simpleCurrCompare('16bit', address.p1Boo, 0),
          simpleCurrCompare('16bit', address.p1Miss, 0),
        ),
        alt2: $(
          isPlayer2Active(),
          isPlayer1Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p2Little, 0),
          isPlayer2Failed().withLast({ rvalue: { value: 0 } }),
          simpleCurrCompare('16bit', address.p2Good, 0),
          simpleCurrCompare('16bit', address.p2Boo, 0),
          simpleCurrCompare('16bit', address.p2Miss, 0),
        ),
      }
    });

    set.addAchievement({
      title: `${c.baseTitle} - Solo Maniac FC`,
      id: c.soloComboId,
      points: 4,
      description: `Get a Full Combo on ${songTitle} Solo Maniac without the Little mod.`,
      conditions: {
        core: $(
          simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
          simpleCurrCompare('Lower4', address.gameDiff, 3, '>='),
          simpleCmpTwoConstants('8bit', address.songId, demoId, songId, 'Prior'),
          simpleCurrCompare('Lower4', address.mainMenuSelection, 1),
          simpleCurrCompare('Lower4', address.playerStyle, 1, '>'),
          trigger(simpleCurrPrevCmp('8bit', address.totalSongsCleared, '!=')),
        ),
        alt1: $(
          isPlayer1Active(),
          isPlayer2Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p1Little, 0),
          isPlayer1Failed().withLast({ rvalue: { value: 0 } }),
          isPlayer1Maniac(),
          simpleCurrCompare('16bit', address.p1Good, 0),
          simpleCurrCompare('16bit', address.p1Boo, 0),
          simpleCurrCompare('16bit', address.p1Miss, 0),
        ),
        alt2: $(
          isPlayer2Active(),
          isPlayer1Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p2Little, 0),
          isPlayer2Failed().withLast({ rvalue: { value: 0 } }),
          isPlayer2Maniac(),
          simpleCurrCompare('16bit', address.p2Good, 0),
          simpleCurrCompare('16bit', address.p2Boo, 0),
          simpleCurrCompare('16bit', address.p2Miss, 0),
        ),
      }
    });

    set.addAchievement({
      title: `${c.baseTitle} - Double Maniac FC`,
      id: c.doubleComboId,
      points: 5,
      description: `Get a Full Combo on ${songTitle} Double Maniac without the Little mod.`,
      conditions: {
        core: $(
          simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
          simpleCurrCompare('Lower4', address.gameDiff, 3, '>='),
          simpleCmpTwoConstants('8bit', address.songId, demoId, songId, 'Prior'),
          simpleCurrCompare('Lower4', address.mainMenuSelection, 0),
          simpleCurrCompare('Lower4', address.style, 2),
          trigger(simpleCurrPrevCmp('8bit', address.totalSongsCleared, '!=')),
        ),
        alt1: $(
          isPlayer1Active(),
          isPlayer2Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p1Little, 0),
          isPlayer1Failed().withLast({ rvalue: { value: 0 } }),
          isPlayer1Maniac(),
          simpleCurrCompare('16bit', address.p1Good, 0),
          simpleCurrCompare('16bit', address.p1Boo, 0),
          simpleCurrCompare('16bit', address.p1Miss, 0),
        ),
        alt2: $(
          isPlayer2Active(),
          isPlayer1Active().withLast({ cmp: '!=' }),
          simpleCurrCompare('Bit2', address.p2Little, 0),
          isPlayer2Failed().withLast({ rvalue: { value: 0 } }),
          isPlayer2Maniac(),
          simpleCurrCompare('16bit', address.p2Good, 0),
          simpleCurrCompare('16bit', address.p2Boo, 0),
          simpleCurrCompare('16bit', address.p2Miss, 0),
        ),
      }
    });
  });

  // Dancing All Alone

  set.addAchievement({
    title: `One Chart & Its Clones - Full Combo`,
    id: 225588,
    points: 3,
    description: `Get a Full Combo on any chart in DANCING ALL ALONE with no Little mod or Versus play.`,
    conditions: {
      core: $(
        simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
        simpleCurrCompare('Lower4', address.gameDiff, 3, '>='),
        simpleCmpTwoConstants('8bit', address.songId, 0x46, 0x1f, 'Prior'),
        simpleCurrCompare('Lower4', address.style, 2, '!='),
        trigger(simpleCurrPrevCmp('8bit', address.totalSongsCleared, '!=')),
      ),
      alt1: $(
        isPlayer1Active(),
        isPlayer2Active().withLast({ cmp: '!=' }),
        simpleCurrCompare('Bit2', address.p1Little, 0),
        isPlayer1Failed().withLast({ rvalue: { value: 0 } }),
        simpleCurrCompare('16bit', address.p1Good, 0),
        simpleCurrCompare('16bit', address.p1Boo, 0),
        simpleCurrCompare('16bit', address.p1Miss, 0),
      ),
      alt2: $(
        isPlayer2Active(),
        isPlayer1Active().withLast({ cmp: '!=' }),
        simpleCurrCompare('Bit2', address.p2Little, 0),
        isPlayer2Failed().withLast({ rvalue: { value: 0 } }),
        simpleCurrCompare('16bit', address.p2Good, 0),
        simpleCurrCompare('16bit', address.p2Boo, 0),
        simpleCurrCompare('16bit', address.p2Miss, 0),
      ),
    }
  });

  // challenge mode cheevos
  Object.keys(challengeSongLookup).map(Number).forEach((s) => {
    const world = Math.floor(s / 10);
    const stage = s % 10;
    const stageEnglish = stage + 1;
    const desc = `Beat ${challengeSetLookup[world]}-${stageEnglish} in Challenge Mode. ${challengeDescLookup[s]}.`;
    set.addAchievement({
      id: 215353 + s,
      title: `Challenge: ${challengeTitleLookup[s]}`,
      points: world + 1,
      description: desc,
      conditions: {
        core: $(
          inChallengeMode(),
          simpleCurrCompare('Lower4', address.challengeWorld, world),
          simpleCurrCompare('Lower4', address.challengeStage, stage),
          resetIf(isSong(71)),
          resetIf(simpleCurrCompare('8bit', address.challengeStars, 88, '<')),
          simpleCurrCompare('8bit', address.challengeStars, 88).withLast({ hits: 90 })
        ),
        alt1: andNext(
          simplePrevCompare('8bit', address.challengePassed, 0, '>'),
          simpleCurrCompare('8bit', address.challengePassed, 0, '>').withLast({ hits: 90 })
        ),
        alt2: andNext(
          simplePrevCompare('8bit', address.challengePassed, 0, '='),
          once(simpleCurrCompare('8bit', address.challengePassed, 0, '>')),
        ),
      }
    });
  });
};

export default makeCheevos;
