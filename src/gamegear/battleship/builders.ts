import { define as $, andNext, measured, orNext } from "@cruncheevos/core";
import { alwaysFalse, simpleCmpTwoConstants, simpleCurrCompare, simpleCurrPrevCmp, simplePrevCompare } from "../../common/builders.js";
import { address } from "./data.js";

export const onTitleScreen = () => orNext(
  simpleCurrCompare('16bit', address.gameState, 0x3ec),
  simpleCurrCompare('16bit', address.gameState, 0x3f3),
);

export const isNotCheater = () => $(
  ['AddSource', 'Mem', 'Bit0', address.cheatDetection],
  ['', 'Mem', 'Bit1', address.cheatDetection, '=', 'Value', '', 0]
);

export const isCheater = () => isNotCheater().withLast({ cmp: '!=' });

export const usingWeapon = (weapon: number) => $(
  simplePrevCompare('8bit', address.firedWeapon, weapon, '='),
  simpleCurrCompare('8bit', address.firedWeapon, weapon)
);

export const anyEnemyShipTookDamage = () => orNext(
  ...[...Array(6)].map((_, i) => {
    const addrHp = address.enemyShipHp1 + (i * 4);
    return simpleCurrPrevCmp('8bit', addrHp, '<');
  })
);

export const usingSonar = () => $(
  simpleCurrCompare('16bit', address.gameState, 0x301, '>='),
  simpleCurrCompare('16bit', address.gameState, 0x303, '<='),
);

export const usingAerialRecon = () => $(
  simpleCurrCompare('16bit', address.gameState, 0x201, '>='),
  simpleCurrCompare('16bit', address.gameState, 0x202, '<='),
);

export const detectedShip = () => simpleCmpTwoConstants('8bit', address.reconDetection, 0x19, 0x32);

export const isRank = (target: number) => simpleCurrCompare('8bit', address.rank, target);

export const onWinScreen = () => simpleCurrCompare('16bit', address.gameState, 483);

export const getAvailableShips = (round: number) => round === 0 ? 4 : round > 5 ? 6 : 5;

export const enemyShipsSunk = (round: number, times: number = 5) => {
  const shipElems = [...Array(getAvailableShips(round))];
  let core = $(
    orNext(...shipElems.map((_, s) => {
      return simplePrevCompare('8bit', address.enemyShipHp1 + (4 * s), 0xff, '!=')
    })),
    ...shipElems.slice(0, 6 - shipElems.length).map((_, s) => {
      return simplePrevCompare('8bit', (address.enemyShipHp1 + 24) - (4 * (s + 1)), 0x00, '=')
    }).reverse(),
    ...shipElems.map((_, s) => {
      return simpleCurrCompare('8bit', address.enemyShipHp1 + (4 * s), 0xff)
    }),
    ...shipElems.slice(0, 6 - shipElems.length).map((_, s) => {
      return simpleCurrCompare('8bit', (address.enemyShipHp1 + 24) - (4 * (s + 1)), 0x00)
    }).reverse(),
  );
  if (times > 1) {
    core = measured(
      andNext(
        core,
        alwaysFalse().withLast({ hits: times })
      )
    )
  }
  return core;
};

export const onVictoryScreen = () => {
  return $(
    ...[...Array(6)].map((_, i) => {
      const addrHp = address.enemyShipHp1 + (i * 4);
      return $(['AddSource', 'Mem', '8bit', addrHp, '%', 'Value', '', 0xff])
    }),
    $(['', 'Value', '', 0, '=', 'Value', '', 0]),
    simplePrevCompare('16bit', address.gameState, 0x1e3, '!='),
    simpleCurrCompare('16bit', address.gameState, 0x1e3)
  );
}
