import { define as $, andNext, once, orNext } from "@cruncheevos/core";
import { cmpInverted, delta, simpleCurrCompare, simplePrevCompare } from "../../common/builders.js";
import { address, platformingStages } from "./data.js";

export const isEasy = () => simpleCurrCompare('8bit', address.difficulty, 0);
export const isChallenge = () => simpleCurrCompare('8bit', address.difficulty, 1);

export const isGameState = (value: number) => simpleCurrCompare('8bit', address.gameState, value);

export const inPlatformStage = () => orNext(...platformingStages.map((s) => simpleCurrCompare('8bit', address.gameState, s)));

export const inStory = () => $(
  simpleCurrCompare('8bit', address.gameState, 0x06, '>='),
  simpleCurrCompare('8bit', address.gameState, 0x5d, '<='),
);

export const inPlayground = () => $(
  simpleCurrCompare('8bit', address.gameState, 0x61, '>='),
  simpleCurrCompare('8bit', address.gameState, 0x86, '<=')
);

export const inPasswordScreen = () => simpleCurrCompare('8bit', address.gameState, 0x88);

export const inTitleScreen = () => simpleCurrCompare('8bit', address.gameState, 0x05, '<=');

export const enteredChapterNormally = (targetState: number) => once(
  andNext(
    cmpInverted(delta(inPasswordScreen().conditions[0])),
    isGameState(targetState)
  )
);

export const clearedStage = () => $(
  simplePrevCompare('8bit', address.gameEndJingle, 0x51, '!='),
  simpleCurrCompare('8bit', address.gameEndJingle, 0x51),
)

export const clearedLevel = (targetState: number) => $(
  isGameState(targetState),
  clearedStage()
);

export const clearedSlideStage = () => {
  const rows = [...Array(3)];
  return {
    alt1: $(
      isEasy(),
      orNext(
        simplePrevCompare('16bitBE', 0xcd87, 0x0102, '!='),
        simplePrevCompare('16bitBE', 0xcd8b, 0x0304, '!='),
        simplePrevCompare('16bitBE', 0xcd8f, 0x0506, '!='),
      ),
      simpleCurrCompare('16bitBE', 0xcd87, 0x0102, '='),
      simpleCurrCompare('16bitBE', 0xcd8b, 0x0304, '='),
      simpleCurrCompare('16bitBE', 0xcd8f, 0x0506, '='),
    ),
    alt2: $(
      isChallenge(),
      orNext(
        simplePrevCompare('24bitBE', 0xcd87, 0x010203, '!='),
        simplePrevCompare('24bitBE', 0xcd8b, 0x040506, '!='),
        simplePrevCompare('24bitBE', 0xcd8f, 0x070809, '!=')
      ),
      simpleCurrCompare('24bitBE', 0xcd87, 0x010203, '='),
      simpleCurrCompare('24bitBE', 0xcd8b, 0x040506, '='),
      simpleCurrCompare('24bitBE', 0xcd8f, 0x070809, '='),
    )
  }
}

// Forgot about the whole sound effect situation...dang it.
export const clearedLabyrinthStory = () => $(
  simplePrevCompare('8bit', address.gameState, 0x1d, '>='),
  simplePrevCompare('8bit', address.gameState, 0x1e, '<='),
  simpleCurrCompare('8bit', address.gameState, 0x1f, '='),
  // ['AddSource', 'Mem', '8bit', address.gameState, '+', 'Invert', 'Bit0', address.difficulty],
  // ['', 'Value', '', 0, '=', 'Value', '', 0x1e],
  // clearedStage()
);

export const clearedPlateStage = () => $(
  ['', 'Mem', '8bit', 0xcdc8, '>', 'Delta', '8bit', 0xcdc7],
  ['', 'Mem', '8bit', 0xcdc8, '=', 'Mem', '8bit', 0xcdc7],
);

export const clearedPlateStory = () => $(
  isGameState(0x28),
  clearedPlateStage(),
);

export const clearedMemoryStage = () => $(
  simplePrevCompare('8bit', 0xcd75, 0x7c, '>='),
  simplePrevCompare('8bit', 0xcd75, 0x91, '<='),
  simpleCurrCompare('8bit', 0xcd75, 0x92)
);

export const clearedMemoryStory = () => $(
  ['Remember', 'Mem', 'Bit0', address.difficulty, '+', 'Value', '', 1],
  ['AddSource', 'Value', '', 6, '*', 'Recall'],
  ['', 'Value', '', 0, '=', 'Mem', '8bit', 0xcd9c],
  isGameState(0x30),
  clearedMemoryStage(),
);

export const clearedDeerStage = () => $(
  simplePrevCompare('16bit', 0xcc11, 0xd000, '<'),
  simpleCurrCompare('16bit', 0xcc11, 0xd000, '>='),
);

export const clearedDeerStory = () => $(
  isGameState(0x3e),
  clearedDeerStage(),
);

export const clearedVultureStage = () => $(
  simplePrevCompare('8bit', address.vulturesRemaining, 1, '>='),
  simplePrevCompare('8bit', address.vulturesRemaining, 2, '<='),
  simpleCurrCompare('8bit', address.vulturesRemaining, 0),
);

export const clearedVultureStory = () => $(
  isGameState(0x48),
  clearedVultureStage(),
);

export const clearedMatchStage = () => {
  const cards = [...Array(16)];
  return $(
    orNext(
      ...cards.map((_, i) => simplePrevCompare('8bit', 0xcd88 + i, 0xff, '!='))
    ),
    ...cards.map((_, i) => simpleCurrCompare('8bit', 0xcd88 + i, 0xff))
  );
};

export const clearedMatchStory = () => $(
  isGameState(0x54),
  clearedMatchStage()
);

export const clearedStackStage = () => ({
  alt1: $(
    isEasy(),
    simplePrevCompare('8bit', address.columnsMatchesRemaining, 0x01, '='),
    simpleCurrCompare('8bit', address.columnsMatchesRemaining, 0xff, '=')
  ),
  alt2: $(
    isChallenge(),
    simplePrevCompare('8bit', address.columnsMatchesRemaining, 0x03, '='),
    simpleCurrCompare('8bit', address.columnsMatchesRemaining, 0x00, '=')
  ),
});

export const isGameOver = () => simpleCurrCompare('8bit', address.gameState, 0x87);
