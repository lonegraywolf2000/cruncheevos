import { RichPresence } from "@cruncheevos/core";
import { isRank, onWinScreen } from "./builders.js";

const rank = {
  0: 'Seaman',
  1: 'Petty Officer',
  2: 'Skipper',
  3: 'Lieutenant',
  4: 'Lt. Commander',
  5: 'Commander',
  6: 'Captain',
  7: 'Admiral',
  8: 'Fleet Admiral'
};

const makeRp = () => {
  const Rank: RichPresence.LookupParams = {
    values: rank,
    name: 'Rank',
    defaultAt: '0xh39a'
  };
  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Number: 'VALUE',
    },
    lookup: { Rank },
    displays: ({ lookup, macro, tag }) => [
      [
        isRank(8),
        tag`${lookup.Rank} Cheevo has dominated the oceans, and is ready to rest.`
      ],
      [
        onWinScreen(),
        tag`${lookup.Rank} Cheevo is ready to take on Battle ${macro.Number.at('0xh39a_v1')}-${macro.Number.at('0xh39b_v1')}.`,
      ],
      tag`${lookup.Rank} Cheevo is taking on the enemy fleet in Battle ${macro.Number.at('0xh39a_v1')}-${macro.Number.at('0xh39b_v1')}.`
    ]
  });

  return rp;
};

export default makeRp;
