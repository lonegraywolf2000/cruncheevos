import { define as $, AchievementSet, andNext, once, orNext, resetIf, trigger } from '@cruncheevos/core';
import { clearedDeerStage, clearedDeerStory, clearedLabyrinthStory, clearedLevel, clearedMatchStage, clearedMatchStory, clearedMemoryStage, clearedMemoryStory, clearedPlateStage, clearedPlateStory, clearedSlideStage, clearedStackStage, clearedStage, clearedVultureStage, clearedVultureStory, enteredChapterNormally, inPasswordScreen, inTitleScreen, isChallenge, isEasy, isGameOver, isGameState } from './builders.js';
import { simpleCurrCompare, simplePrevCompare } from '../../common/builders.js';
import { address } from './data.js';

const makeCheevos = (set: AchievementSet) => {
  // story cheevos here. Probably should loop these.
  set.addAchievement({
    title: 'Rose to the Occasion',
    points: 3,
    type: 'progression',
    description: 'Complete Chapter 1.',
    conditions: {
      core: $(
        resetIf(inTitleScreen()),
        resetIf(isGameOver()),
        resetIf(inPasswordScreen()),
        enteredChapterNormally(0x09),
        isGameState(0x0c)
      ),
      ...clearedSlideStage(),
    }
  });

  set.addAchievement({
    title: 'I Believe I Can Butterfly',
    points: 4,
    type: 'progression',
    description: 'Complete Chapter 2.',
    conditions: $(
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(inPasswordScreen()),
      enteredChapterNormally(0x09),
      clearedLabyrinthStory(),
    )
  });

  set.addAchievement({
    title: 'Hop, Skip, Jump',
    points: 4,
    type: 'progression',
    description: 'Complete Chapter 3.',
    conditions: $(
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(inPasswordScreen()),
      enteredChapterNormally(0x09),
      clearedPlateStory(),
    ),
  });

  set.addAchievement({
    title: 'Merry Melodies',
    points: 4,
    type: 'progression',
    description: 'Complete Chapter 4.',
    conditions: $(
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(inPasswordScreen()),
      enteredChapterNormally(0x09),
      clearedMemoryStory()
    )
  });

  set.addAchievement({
    title: 'Apple of My Eye',
    points: 5,
    type: 'progression',
    description: 'Complete Chapter 5.',
    conditions: $(
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(inPasswordScreen()),
      enteredChapterNormally(0x09),
      clearedDeerStory(),
    )
  });

  set.addAchievement({
    title: 'Life in the Mines',
    points: 5,
    type: 'progression',
    description: 'Complete Chapter 6.',
    conditions: $(
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(inPasswordScreen()),
      enteredChapterNormally(0x09),
      clearedVultureStory(),
    )
  });

  set.addAchievement({
    title: 'Becoming Boulder',
    points: 5,
    type: 'progression',
    description: 'Complete Chapter 7.',
    conditions: $(
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(inPasswordScreen()),
      enteredChapterNormally(0x09),
      clearedMatchStory(),
    )
  });

  set.addAchievement({
    title: 'Puzzling Awakening',
    points: 5,
    type: 'win_condition',
    description: 'Complete Chapter 8, the final chapter.',
    conditions: {
      core: $(
        resetIf(inTitleScreen()),
        resetIf(isGameOver()),
        resetIf(inPasswordScreen()),
        enteredChapterNormally(0x09),
        isGameState(0x5a),
      ),
      ...clearedStackStage(),
    }
  });

  set.addAchievement({
    title: 'Happily Ever After',
    points: 10,
    description: 'Complete the story mode on challenge difficulty.',
    conditions: $(
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(inPasswordScreen()),
      resetIf(isEasy()),
      enteredChapterNormally(0x09),
      isGameState(0x5a),
      ...clearedStackStage()['alt2'].conditions.slice(-2),
    )
  });

  // bonus minigame challenges here.
  set.addAchievement({
    title: 'Slip and Slide',
    points: 5,
    description: 'Complete all three sliding puzzles on challenge difficulty.',
    conditions: $(
      isChallenge(),
      isGameState(0x61),
      ...clearedSlideStage().alt2.conditions.splice(1),
    )
  });

  set.addAchievement({
    title: 'David Bowie Called',
    points: 10,
    description: 'Complete all four labyrinth puzzles back to back on challenge difficulty.',
    conditions: $(
      isChallenge(),
      simplePrevCompare('8bit', address.gameState, 0x72, '='),
      isGameState(0x73),
    ),
  });

  set.addAchievement({
    title: 'Blue Plate Special',
    points: 5,
    description: 'Catch every plate in challenge difficulty.',
    conditions: $(
      isChallenge(),
      orNext(
        isGameState(0x75),
        isGameState(0x28),
      ),
      simpleCurrCompare('8bit', 0xcdca, 0),
      trigger(andNext(
        clearedPlateStage()
      )),
    )
  });

  set.addAchievement({
    title: 'Melody Madness',
    points: 10,
    description: 'Play the memory game perfectly on challenge difficulty.',
    conditions: $(
      resetIf(isEasy()),
      resetIf(simpleCurrCompare('8bit', address.gameEndJingle, 0x4f)),
      once(
        andNext(
          orNext(
            isGameState(0x78),
            isGameState(0x30),
          ),
          simplePrevCompare('8bit', address.gameState, 0x78, '!='),
          simplePrevCompare('8bit', address.gameState, 0x30, '!='),
        )
      ),
      trigger(andNext(
        simpleCurrCompare('8bit', 0xcd9c, 12),
        clearedMemoryStage()
      )),
    )
  });

  set.addAchievement({
    title: 'Oh Deer',
    points: 5,
    description: 'Complete the Deer minigame on challenge difficulty without taking damage.',
    conditions: $(
      isChallenge(),
      orNext(
        isGameState(0x7b),
        isGameState(0x3e),
      ),
      simpleCurrCompare('8bit', 0xcc1a, 4),
      clearedDeerStage(),
    )
  });

  set.addAchievement({
    title: 'Vulture Culture',
    points: 5,
    description: 'Complete the Vulture minigame on challenge difficulty without having any vulture flying on the third row.',
    conditions: $(
      resetIf(isEasy()),
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(simpleCurrCompare('8bit', 0xcc14, 4)),
      resetIf(simpleCurrCompare('8bit', 0xcc24, 4)),
      resetIf(simpleCurrCompare('8bit', 0xcc34, 4)),
      once(
        andNext(
          orNext(
            isGameState(0x7e),
            isGameState(0x48),
          ),
          simplePrevCompare('8bit', address.gameState, 0x7e, '!='),
          simplePrevCompare('8bit', address.gameState, 0x48, '!='),
        )
      ),
      clearedVultureStage(),
    )
  });

  set.addAchievement({
    title: 'Match Made in Heaven?',
    points: 5,
    description: 'Match all cards with 30 seconds remaining on challenge difficulty.',
    conditions: $(
      isChallenge(),
      orNext(
        isGameState(0x81),
        isGameState(0x54),
      ),
      simpleCurrCompare('8bit', 0xcd87, 30, '>='),
      trigger(andNext(clearedMatchStage())),
    )
  });

  set.addAchievement({
    title: 'Stack Slimming',
    points: 5,
    description: 'While playing Stacker on challenge difficulty, never let a column stack to 3 unmatched.',
    conditions: $(
      resetIf(isEasy()),
      resetIf(inTitleScreen()),
      resetIf(isGameOver()),
      resetIf(andNext(
        simpleCurrCompare('8bit', address.gameState, 0x5b, '>='),
        simpleCurrCompare('8bit', address.gameState, 0x84, '<='),
      )),
      ...[...Array(6)].map((_, i) => resetIf(andNext(
        simplePrevCompare('8bit', 0xcdbc + i, 0xff, '='),
        simpleCurrCompare('8bit', 0xcdbc + i, 0xff, '!=')
      ))),
      once(
        andNext(
          orNext(
            isGameState(0x85),
            isGameState(0x5a),
          ),
          simplePrevCompare('8bit', address.gameState, 0x85, '!='),
          simplePrevCompare('8bit', address.gameState, 0x5a, '!='),
        )
      ),
      trigger(andNext(
        ...clearedStackStage()['alt2'].conditions.slice(-2)
      )),
    )
  });
};

export default makeCheevos;
