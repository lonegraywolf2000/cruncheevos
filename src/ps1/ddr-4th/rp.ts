import { define as $, Condition, ConditionBuilder, measured, orNext, RichPresence } from "@cruncheevos/core";
import { allPlayersFailed, inAreYouReady, inCautionScreen, inChallengeMode, inDancemaniaAd, inDemoPlay, inDifficultySelection, inEditMode, inGameModeSettings, inHereWeGo, inHowToPlay, inInfoMenu, inIntroScreens, inKonamiJingle, inLessonMode, inMainMenu, inNonstopOrderMode, inOptionsMenu, inShowMeYourMoves, inSongSelection, inTitleScreen, inTrainingMode, isChallengeWorld, isPlayer1Difficulty, isGameState, isInitializing, isLoadingSong, isPlayer1Active, isPlayer1Failed, isPlayer2Active, isPlayer2Failed, isSong, isViewingRecords, rpChallengeMath, rpDoneWithSong, rpLoadingChallenge, rpSelectingCharacter, rpStyleMath } from "./builders.js";
import { address, allSongIdLookup, challengeDescLookup, challengeSetLookup, challengeSongLookup, difficultyLookup, playerOffset } from "./data.js";
import { plusOne, simpleCurrCompare } from "../../common/builders.js";
import { memorySizeToRp } from "../../common/rp.js";

const reg = /@\w+\((?<prefix>0[xX])(?<size>[G-Zg-z ])?(?<addr>[0-9a-fA-F]+)\)/;

const styleLookup = {
  0x00: 'Single',
  0x01: 'Single',
  0x02: 'Double',
  0x05: 'Versus',
  0x07: 'Double',
  0x10: 'Single',
  0x11: 'Single',
  0x12: 'Solo',
  0x15: 'Solo',
  0x17: 'Solo',
};

const builderStripper = (code: ConditionBuilder) => {
  const str = code.toString();
  return str.substring(0, str.length - 2);
};

const makeRp = () => {
  const Style: RichPresence.LookupParams = {
    values: styleLookup,
    name: 'Style',
    defaultAt: builderStripper(measured(rpStyleMath())),
  };

  const Song: RichPresence.LookupParams = {
    values: allSongIdLookup,
    name: 'Song',
    defaultAt: builderStripper(isSong(0)),
  };

  const ChallengeSong: RichPresence.LookupParams = {
    values: { ...challengeSongLookup, '*': 'Mu' },
    name: 'ChallengeSong',
    defaultAt: builderStripper(measured(rpChallengeMath(0))),
  }

  const ChallengeMission: RichPresence.LookupParams = {
    values: { ...challengeDescLookup, '*': `Don't Fail` },
    name: 'ChallengeMission',
    defaultAt: builderStripper(measured(rpChallengeMath(0))),
  };

  const ChallengeSet: RichPresence.LookupParams = {
    values: challengeSetLookup,
    name: 'ChallengeSet',
    defaultAt: builderStripper(isChallengeWorld(0)),
  };

  const Difficulty: RichPresence.LookupParams = {
    values: difficultyLookup,
    name: 'Difficulty',
    defaultAt: builderStripper(isPlayer1Difficulty(0)),
  };

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Number: 'VALUE',
    },
    lookup: {
      ChallengeMission,
      ChallengeSet,
      ChallengeSong,
      Difficulty,
      Song,
      Style,
    },
    displays: ({ lookup, macro, tag }) => {
      const simpleOffset = (myLookup: typeof lookup.Difficulty) => {
        const raw = myLookup.at();
        const matches = raw.match(reg)!;
        const groups = matches.groups!;
        const addr = Number(groups.prefix + groups.addr) + playerOffset;
        const size = groups.size ?? ' ';
        return myLookup.at(`0x${size}${addr.toString(16)}`);
      };

      const hexIt = (addr: number, size: Condition.Size = '16bit') => {
        return macro.Number.at(`${memorySizeToRp(size)}${addr.toString(16)}`)
      };

      return [
        [
          $(inDifficultySelection(), isPlayer1Active(), isPlayer2Active()),
          tag`Deciding Difficulty on ${lookup.Song}: ${lookup.Difficulty} vs ${simpleOffset(lookup.Difficulty)}}`
        ],
        [
          $(inDifficultySelection(), isPlayer1Active()),
          tag`Deciding Difficulty on ${lookup.Song} ${lookup.Style}: Maybe ${lookup.Difficulty}?`,
        ],
        [
          $(inDifficultySelection(), isPlayer2Active()),
          tag`Deciding Difficulty on ${lookup.Song} ${lookup.Style}: Maybe ${simpleOffset(lookup.Difficulty)}?`,
        ],
        [inDifficultySelection(), 'Thinking about which Difficulty to Play'],
        [rpSelectingCharacter(), `Selecting the Group/Character for Today`],
        [inSongSelection(), tag`Thinking about playing ${lookup.Song} ${lookup.Style}`],
        [inGameModeSettings(), `Setting up the Mode`],
        // End of song: check for failure bytes.
        [
          $(
            rpDoneWithSong(), isPlayer1Active(), isPlayer2Active(), allPlayersFailed(),
            ['', 'Mem', 'Lower4', address.p1Difficulty, '=', 'Mem', 'Lower4', address.p2Difficulty]
          ),
          tag`Failed on ${lookup.Song} ${lookup.Difficulty} ${lookup.Style}`
        ],
        [
          $(
            rpDoneWithSong(), isPlayer1Active(), isPlayer2Active(), allPlayersFailed()
          ),
          tag`Failed on ${lookup.Song} ${lookup.Difficulty} & ${simpleOffset(lookup.Difficulty)}`
        ],
        [
          $(
            rpDoneWithSong(), isPlayer1Active(), isPlayer2Active(),
            allPlayersFailed().withLast({ cmp: '!=' }),
            isPlayer1Failed(),
            isPlayer2Failed()
          ),
          tag`Failed on ${lookup.Song} ${lookup.Difficulty} & ${simpleOffset(lookup.Difficulty)}...but got song credit anyway?`
        ],
        [
          $(
            rpDoneWithSong(), isPlayer1Active(), isPlayer2Active(),
            allPlayersFailed().withLast({ cmp: '!=' }),
            isPlayer1Failed(),
            isPlayer2Failed().withLast({ cmp: '!=' }),
          ),
          tag`Results on ${lookup.Song}: ${lookup.Difficulty} ${hexIt(address.p1Perfect)}/${hexIt(address.p1Great)}/${hexIt(address.p1Good)}/${hexIt(address.p1Boo)}/${hexIt(address.p1Miss)} ${hexIt(address.p1Score, '32bit')} ${hexIt(address.p1Combo)} - Failed`,
        ],
        [
          $(
            rpDoneWithSong(), isPlayer1Active(), isPlayer2Active(),
            allPlayersFailed().withLast({ cmp: '!=' }),
            isPlayer1Failed().withLast({ cmp: '!=' }),
            isPlayer2Failed(),
          ),
          tag`Results on ${lookup.Song}: Failed - ${simpleOffset(lookup.Difficulty)} ${hexIt(address.p2Perfect)}/${hexIt(address.p2Great)}/${hexIt(address.p2Good)}/${hexIt(address.p2Boo)}/${hexIt(address.p2Miss)} ${hexIt(address.p2Score, '32bit')} ${hexIt(address.p2Combo)}`,
        ],
        [
          $(
            rpDoneWithSong(), isPlayer1Active(), isPlayer2Active(),
            allPlayersFailed().withLast({ cmp: '!=' }),
            ['', 'Mem', 'Lower4', address.p1Difficulty, '=', 'Mem', 'Lower4', address.p2Difficulty],
          ),
          tag`Results on ${lookup.Song} ${lookup.Difficulty}: ${hexIt(address.p1Perfect)}/${hexIt(address.p1Great)}/${hexIt(address.p1Good)}/${hexIt(address.p1Boo)}/${hexIt(address.p1Miss)} ${hexIt(address.p1Score, '32bit')} ${hexIt(address.p1Combo)} vs ${hexIt(address.p2Perfect)}/${hexIt(address.p2Great)}/${hexIt(address.p2Good)}/${hexIt(address.p2Boo)}/${hexIt(address.p2Miss)} ${hexIt(address.p2Score, '32bit')} ${hexIt(address.p2Combo)}`,
        ],
        [
          $(
            rpDoneWithSong(), isPlayer1Active(), isPlayer2Active(),
            allPlayersFailed().withLast({ cmp: '!=' }),
          ),
          tag`Results on ${lookup.Song}: ${lookup.Difficulty} ${hexIt(address.p1Perfect)}/${hexIt(address.p1Great)}/${hexIt(address.p1Good)}/${hexIt(address.p1Boo)}/${hexIt(address.p1Miss)} ${hexIt(address.p1Score, '32bit')} ${hexIt(address.p1Combo)} vs ${simpleOffset(lookup.Difficulty)} ${hexIt(address.p2Perfect)}/${hexIt(address.p2Great)}/${hexIt(address.p2Good)}/${hexIt(address.p2Boo)}/${hexIt(address.p2Miss)} ${hexIt(address.p2Score, '32bit')} ${hexIt(address.p2Combo)}`,
        ],
        [
          $(rpDoneWithSong(), isPlayer1Active(), isPlayer1Failed()),
          tag`Failed on ${lookup.Song} ${lookup.Difficulty} ${lookup.Style}`
        ],
        [
          $(rpDoneWithSong(), isPlayer1Active()),
          tag`Results on ${lookup.Song} ${lookup.Difficulty} ${lookup.Style}: ${hexIt(address.p1Perfect)}/${hexIt(address.p1Great)}/${hexIt(address.p1Good)}/${hexIt(address.p1Boo)}/${hexIt(address.p1Miss)} ${hexIt(address.p1Score, '32bit')} ${hexIt(address.p1Combo)}`
        ],
        [
          $(rpDoneWithSong(), isPlayer2Active(), isPlayer2Failed()),
          tag`Failed on ${lookup.Song} ${simpleOffset(lookup.Difficulty)} ${lookup.Style}`
        ],
        [
          $(rpDoneWithSong(), isPlayer2Active()),
          tag`Results on ${lookup.Song} ${simpleOffset(lookup.Difficulty)} ${lookup.Style}: ${hexIt(address.p2Perfect)}/${hexIt(address.p2Great)}/${hexIt(address.p2Good)}/${hexIt(address.p2Boo)}/${hexIt(address.p2Miss)} ${hexIt(address.p2Score, '32bit')} ${hexIt(address.p2Combo)}`
        ],
        [rpDoneWithSong(), tag`Passed the song ${lookup.Song} ${lookup.Style}`],
        // Gameplay
        [
          $(
            inHereWeGo(), isPlayer1Active(), isPlayer2Active(),
            ['', 'Mem', 'Lower4', address.p1Difficulty, '=', 'Mem', 'Lower4', address.p2Difficulty],
          ),
          tag`${lookup.Song} ${lookup.Difficulty}: ${hexIt(address.p1Perfect)}/${hexIt(address.p1Great)}/${hexIt(address.p1Good)}/${hexIt(address.p1Boo)}/${hexIt(address.p1Miss)} ${hexIt(address.p1Score, '32bit')} ${hexIt(address.p1Combo)} vs ${hexIt(address.p2Perfect)}/${hexIt(address.p2Great)}/${hexIt(address.p2Good)}/${hexIt(address.p2Boo)}/${hexIt(address.p2Miss)} ${hexIt(address.p2Score, '32bit')} ${hexIt(address.p2Combo)}`,
        ],
        [
          $(inHereWeGo(), isPlayer1Active(), isPlayer2Active(),),
          tag`${lookup.Song}: ${lookup.Difficulty} ${hexIt(address.p1Perfect)}/${hexIt(address.p1Great)}/${hexIt(address.p1Good)}/${hexIt(address.p1Boo)}/${hexIt(address.p1Miss)} ${hexIt(address.p1Score, '32bit')} ${hexIt(address.p1Combo)} vs ${simpleOffset(lookup.Difficulty)} ${hexIt(address.p2Perfect)}/${hexIt(address.p2Great)}/${hexIt(address.p2Good)}/${hexIt(address.p2Boo)}/${hexIt(address.p2Miss)} ${hexIt(address.p2Score, '32bit')} ${hexIt(address.p2Combo)}`,
        ],
        [
          $(inHereWeGo(), isPlayer1Active()),
          tag`${lookup.Song} ${lookup.Difficulty} ${lookup.Style}: ${hexIt(address.p1Perfect)}/${hexIt(address.p1Great)}/${hexIt(address.p1Good)}/${hexIt(address.p1Boo)}/${hexIt(address.p1Miss)} ${hexIt(address.p1Score, '32bit')} ${hexIt(address.p1Combo)}`
        ],
        [
          $(inHereWeGo(), isPlayer2Active()),
          tag`${lookup.Song} ${simpleOffset(lookup.Difficulty)} ${lookup.Style}: ${hexIt(address.p2Perfect)}/${hexIt(address.p2Great)}/${hexIt(address.p2Good)}/${hexIt(address.p2Boo)}/${hexIt(address.p2Miss)} ${hexIt(address.p2Score, '32bit')} ${hexIt(address.p2Combo)}`
        ],
        [
          $(
            inAreYouReady(), isPlayer1Active(), isPlayer2Active(),
            ['', 'Mem', 'Lower4', address.p1Difficulty, '=', 'Mem', 'Lower4', address.p2Difficulty],
          ),
          tag`About to Dance to ${lookup.Song} on ${lookup.Difficulty}`
        ],
        [
          $(inAreYouReady(), isPlayer1Active(), isPlayer2Active()),
          tag`About to Dance to ${lookup.Song}: ${lookup.Difficulty} vs ${simpleOffset(lookup.Difficulty)}`
        ],
        [
          $(inAreYouReady(), isPlayer1Active()),
          tag`About to Dance to ${lookup.Song} on ${lookup.Difficulty} ${lookup.Style}`
        ],
        [
          $(inAreYouReady(), isPlayer2Active()),
          tag`About to Dance to ${lookup.Song} on ${simpleOffset(lookup.Difficulty)} ${lookup.Style}`
        ],
        [
          inAreYouReady(),
          tag`About to Dance to ${lookup.Song} ${lookup.Style}`
        ],
        // loading
        [
          $(
            isLoadingSong(), isPlayer1Active(), isPlayer2Active(),
            ['', 'Mem', 'Lower4', address.p1Difficulty, '=', 'Mem', 'Lower4', address.p2Difficulty],
          ),
          tag`Loading the ${lookup.Difficulty} chart for ${lookup.Song}`
        ],
        [
          $(isLoadingSong(), isPlayer1Active(), isPlayer2Active()),
          tag`Loading the ${lookup.Difficulty} & ${simpleOffset(lookup.Difficulty)} charts for ${lookup.Song}`
        ],
        [
          $(isLoadingSong(), isPlayer1Active()),
          tag`Loading the ${lookup.Difficulty} ${lookup.Style} chart for ${lookup.Song}`
        ],
        [
          $(isLoadingSong(), isPlayer2Active()),
          tag`Loading the ${simpleOffset(lookup.Difficulty)} ${lookup.Style} chart for ${lookup.Song}`
        ],
        [
          isLoadingSong(),
          tag`Loading the charts for ${lookup.Song} ${lookup.Style}`,
        ],
        // The rest
        [inCautionScreen(), `Bypassing the Health and Safety Warnings`],
        [inMainMenu(), `Welcome to DDR 4th Mix`],
        [
          orNext(
            isInitializing(),
            inKonamiJingle(),
            inIntroScreens(),
            inDancemaniaAd(),
            inShowMeYourMoves(),
            inTitleScreen(),
            inDemoPlay(),
            inHowToPlay()
          ),
          `Watching the Intro Cycle`
        ],
        [inLessonMode(), `Learning the Ropes`],
        [$(inTrainingMode(), isSong(0).withLast({ 'cmp': '>' })), tag`Practicing ${lookup.Song}`],
        [inTrainingMode(), `Practicing Hard Charts`], // Eventually get a song ID in here.
        [inEditMode(), `Creating a New Step Chart`],
        [inNonstopOrderMode(), `Adjusting Custom Courses`],
        [isViewingRecords(), `Viewing Score Records`],
        [inOptionsMenu(), `Configuring DDR for Optimal Play`],
        [inInfoMenu(), `Reviewing What Was Unlocked`],
        [$(inChallengeMode(), isSong(0x38)), tag`Completed All Missions in the ${lookup.ChallengeSet} Set`],
        [rpLoadingChallenge(), 'Setting up Challenge Mode'],
        [
          $(inChallengeMode(), isSong(0x47)),
          tag`Thinking about Challenge ${lookup.ChallengeSet}-${macro.Number.at(builderStripper(measured(plusOne(simpleCurrCompare('Lower4', address.challengeStage, 0)))))} ${lookup.ChallengeSong}: ${lookup.ChallengeMission}`
        ],
        [
          inChallengeMode(),
          tag`Playing Challenge ${lookup.ChallengeSet}-${macro.Number.at(builderStripper(measured(plusOne(simpleCurrCompare('Lower4', address.challengeStage, 0)))))} ${lookup.ChallengeSong}: ${lookup.ChallengeMission}`
        ],
        'Playing DDR - 4th Mix'
      ];
    },
  });

  return rp;
};

export default makeRp;
