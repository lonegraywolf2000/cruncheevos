import { define as $, AchievementSet, once, resetIf } from "@cruncheevos/core";
import { address, chartClearData, demo, difficultyLookup, playerOffset, simpleStyleLookup, song, songDisplayNames } from "./data.js";
import { alwaysFalse, alwaysTrue, simpleCurrCompare, simpleCurrPrevCmp } from "../../common/builders.js";
import { inEndOfSong, inEvaluationScreen, isPlayer1Active, isPlayer1Difficulty, isPlayer1Failed, isPlayer1LittleOff, isPlayer2Active, isSong } from "./builders.js";

const makeBoards = (set: AchievementSet) => {
  const allowedStyles = [1, 10];
  const allowedDiffs = [1, 2, 3];
  const localOffset = $(['AddAddress', 'Mem', '8bit', 0xc30c8, '*', 'Value', '', 0x499]);
  const keys = chartClearData.map((c) => c.songKey);
  keys.push('Dance');
  keys.sort();
  let id = 33788;
  allowedStyles.forEach((s) => {
    keys.forEach((c) => {
      const songTitle = songDisplayNames[c];
      const songId = song[c];
      allowedDiffs.forEach((d) => {
        let canPass = false;
        if (c !== 'Dance') {
          canPass = true;
        } else if (s == 1 && d == 1) {
          canPass = true;
        }
        if (!canPass) {
          return;
        }

        const descPart = (c === 'Dance' ? `any chart of ${songTitle}` : `${songTitle} ${simpleStyleLookup[s]} ${difficultyLookup[d]}`);

        set.addLeaderboard({
          title: `${songTitle} ${(c === 'Dance' ? '' : `${simpleStyleLookup[s]} ${difficultyLookup[d]} `)}Score Attack`,
          description: `Get the highest score you can on ${descPart} by yourself.`,
          type: 'SCORE',
          lowerIsBetter: false,
          id,
          conditions: {
            start: {
              core: $(
                simpleCurrCompare('16bit', address.activeStageNumber, 65535, '<'),
                (c !== 'Dance' && simpleCurrCompare('Lower4', address.style, s)),
                isSong(songId),
                localOffset,
                isPlayer1LittleOff(),
                localOffset,
                isPlayer1Difficulty(d),
                localOffset,
                isPlayer1Failed().withLast({ rvalue: { value: 0 } }),
                once(simpleCurrPrevCmp('8bit', address.gameState, '>')),
                inEvaluationScreen().withLast({ hits: 100 }),
                once(simpleCurrPrevCmp('8bit', address.totalSongsCleared, '!=')),
                resetIf(inEndOfSong().withLast({ cmp: '<' })),
                resetIf(inEvaluationScreen().withLast({ cmp: '>' })),
              ),
              alt1: $(
                isPlayer1Active(),
                isPlayer2Active().withLast({ rvalue: { value: 0 } })
              ),
              alt2: $(
                isPlayer1Active().withLast({ rvalue: { value: 0 } }),
                isPlayer2Active()
              ),
            },
            cancel: alwaysFalse(),
            submit: alwaysTrue(),
            value: $(
              $(['AddAddress', 'Mem', 'Bit1', address.activePlayers, '*', 'Value', '', playerOffset]),
              ['Measured', 'Mem', '32bit', address.p1Score, '-', 'Mem', '32bit', address.p1PrevScore]
            ),
          }
        });
        id++;
      });
    });
  });
};

export default makeBoards;
