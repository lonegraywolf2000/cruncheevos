import { define as $, addHits, andNext, Condition, measured, once, orNext, pauseIf } from '@cruncheevos/core';
import { alwaysFalse, simpleCurrCompare } from "../../common/builders.js";
import { address } from "./data.js";

export const isGameState = (value: number) => simpleCurrCompare('8bit', address.gameState, value);

export const isInitializing = () => isGameState(0x00);
export const isLoadingSong = () => isGameState(0x01);
export const inAreYouReady = () => isGameState(0x02);
export const inHereWeGo = () => isGameState(0x04);
export const inEndOfSong = () => isGameState(0x05);
export const inEvaluationScreen = () => isGameState(0x06);
export const inGameModeSettings = () => isGameState(0x09);
export const inGroupSelection = () => isGameState(0x0b);
export const inSongSelection = () => isGameState(0x0c);
export const inDifficultySelection = () => isGameState(0x0d);

export const inCautionScreen = () => isGameState(0x1a);
export const inMainMenu = () => isGameState(0x1c);
export const inKonamiJingle = () => isGameState(0x1e);
export const inIntroScreens = () => isGameState(0x1f);
export const inDancemaniaAd = () => isGameState(0x20);
export const inShowMeYourMoves = () => isGameState(0x21);
export const inTitleScreen = () => isGameState(0x22);
export const inDemoPlay = () => isGameState(0x23);
export const inHowToPlay = () => isGameState(0x24);
export const inLessonMode = () => isGameState(0x2e);
export const inTrainingMode = () => isGameState(0x2f);
export const inEditMode = () => isGameState(0x30);
export const inNonstopOrderMode = () => isGameState(0x32);
export const isViewingRecords = () => isGameState(0x33);
export const inOptionsMenu = () => isGameState(0x34);
export const inInfoMenu = () => isGameState(0x35);
export const inChallengeMode = () => isGameState(0x38);
export const inArcadeLink = () => isGameState(0x39);

export const inTraditionalGame = () => simpleCurrCompare('Lower4', address.mainMenuSelection, 0);
export const inSoloGame = () => simpleCurrCompare('Lower4', address.mainMenuSelection, 1);

export const isSong = (value: number) => simpleCurrCompare('8bit', address.songId, value);

export const isChallengeWorld = (value: number) => simpleCurrCompare('Lower4', address.challengeWorld, value);

export const isPlayer1Difficulty = (value: number) => simpleCurrCompare('Lower4', address.p1Difficulty, value);
export const isPlayer1Basic = () => isPlayer1Difficulty(1);
export const isPlayer1Trick = () => isPlayer1Difficulty(2);
export const isPlayer1Maniac = () => isPlayer1Difficulty(3);

export const isPlayer2Difficulty = (value: number) => simpleCurrCompare('Lower4', address.p2Difficulty, value);
export const isPlayer2Basic = () => isPlayer2Difficulty(1);
export const isPlayer2Trick = () => isPlayer2Difficulty(2);
export const isPlayer2Maniac = () => isPlayer2Difficulty(3);

export const isPlayerActive = (player: 'Bit0' | 'Bit1') => simpleCurrCompare(player, address.activePlayers, 1);
export const isPlayer1Active = () => isPlayerActive('Bit0');
export const isPlayer2Active = () => isPlayerActive('Bit1');

export const isPlayer1Failed = () => simpleCurrCompare('Bit0', address.p1Failed, 1);
export const isPlayer2Failed = () => simpleCurrCompare('Bit0', address.p2Failed, 1);
export const allPlayersFailed = () => simpleCurrCompare('Bit0', address.allPlayersFailed, 1);

export const isPlayer1LittleOff = () => simpleCurrCompare('Bit2', address.p1Little, 0);

export const isGradeForSongMet = (baseAddress: number, mem: Condition.ValueType) => $(
  ...[...Array(9)].map((_, i) => $(['AddSource', 'Value', '', 5, '/', mem, '8bit', baseAddress + i])),
  once(addHits(['', 'Value', '', 0, '>', 'Value', '', 0])),
);

export const pauseIfMashingDPad = () => $(
  ...[0, 1].flatMap((i) => pauseIf(andNext(
    inHereWeGo(),
    simpleCurrCompare('Upper4', 0x1006d + (i * 0x10), 15).withLast({ hits: 30 }),
  ))),
);

export const rpStyleMath = () => $(
  ['AddSource', 'Mem', 'Lower4', address.mainMenuSelection, '*', 'Value', '', 0x10],
  simpleCurrCompare('Lower4', address.playerStyle, 0),
);

export const rpChallengeMath = (value: number) => $(
  ['AddSource', 'Mem', 'Lower4', address.challengeWorld, '*', 'Value', '', 10],
  simpleCurrCompare('Lower4', address.challengeStage, value),
);

export const rpLoadingChallenge = () => $(
  inChallengeMode(),
  orNext(isSong(0x41), isSong(0)),
);

export const rpSelectingCharacter = () => orNext(
  andNext(
    inSongSelection(),
    isSong(0x41)
  ),
  inGroupSelection()
);

export const rpDoneWithSong = () => $(
  inEndOfSong().withLast({ cmp: '>=' }),
  inEvaluationScreen().withLast({ cmp: '<=' }),
);
