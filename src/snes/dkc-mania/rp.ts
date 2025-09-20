import { define as $, ConditionBuilder, RichPresence } from "@cruncheevos/core";
import { actionLookup, address, kongLookup, roomLookup } from "./data.js";
import { currentKongRp, inGame, inOverworld } from "./builders.js";
import { simpleCurrCompare } from "../../common/builders.js";

const builderStripper = (code: ConditionBuilder) => {
  const str = code.toString();
  return str.substring(0, str.length - 2);
};

const makeRp = () => {
  const roomIdStr = simpleCurrCompare('8bit', address.roomId, 0);
  const elapsedTime = $(['Measured', 'Mem', '16bit', 0x48]);

  const Action: RichPresence.LookupParams = {
    values: actionLookup,
    name: 'Action',
    defaultAt: builderStripper(roomIdStr),
  };
  const Kong: RichPresence.LookupParams = {
    values: kongLookup,
    name: 'Kong',
    defaultAt: builderStripper(currentKongRp),
  };
  const Room: RichPresence.LookupParams = {
    values: roomLookup,
    name: 'Room',
    defaultAt: builderStripper(roomIdStr),
  };

  const rp = RichPresence({
    lookupDefaultParameters: { keyFormat: 'dec', compressRanges: true },
    format: {
      Score: 'VALUE',
    },
    lookup: {
      Action,
      Kong,
      Room,
    },
    displays: ({ lookup, macro, tag }) => [
      [
        $(inGame(), inOverworld()),
        tag`${lookup.Kong} thinking about ${lookup.Action} ${lookup.Room} - ⏰${macro.Number.at(elapsedTime)} Minutes so far`,
      ],
      [
        inGame(),
        tag`${lookup.Kong} ${lookup.Action} ${lookup.Room} - ⏰${macro.Number.at(elapsedTime)} Minutes so far`,
      ],
      'A Mania without Hedgehogs',
    ],
  });

  return rp;
};

export default makeRp;
