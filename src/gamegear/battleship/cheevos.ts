import { define as $, AchievementSet, andNext, ConditionBuilder, measured, orNext, pauseIf, resetIf } from "@cruncheevos/core";
import { address, damagelessData, progressionData, weaponData } from "./data.js";
import { anyEnemyShipTookDamage, detectedShip, enemyShipsSunk, isCheater, isNotCheater, isRank, usingAerialRecon, usingSonar, usingWeapon } from "./builders.js";
import { alwaysFalse, simpleCurrCompare, simpleCurrPrevCmp, simplePrevCompare } from "../../common/builders.js";

const makeCheevos = (set: AchievementSet) => {
  progressionData.forEach((data) => {
    const descSuffix = data.password ? `The only password allowed is ${data.password}.` : `No passwords are allowed.`;
    set.addAchievement({
      title: data.title,
      points: data.points,
      type: 'progression',
      description: `Win all five battles of Level ${data.level}. ${descSuffix}`,
      conditions: $(
        pauseIf(isCheater()),
        resetIf(isRank(data.level - 1).withLast({ cmp: '!=' })),
        resetIf(simpleCurrCompare('16bit', address.gameState, 0x3f3)),
        andNext(
          ...[...Array(6)].map((_, i) => $(
            ['AddSource', 'Delta', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
          )),
          ['', 'Value', '', 0, '>', 'Value', '', 0],
          ...[...Array(6)].map((_, i) => $(
            ['AddSource', 'Mem', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
          )),
          measured(['', 'Value', '', 0, '=', 'Value', '', 0]).withLast({ hits: 5 }),
        )
      )
    });
  });

  // Cheevos for weapons.
  weaponData.forEach((data) => {
    const suffix = data.fire === 'Regular' ? 'damage the enemy fleet' : ('detect the enemy ' + (data.fire === 'ScoutShip' ? 'fleet' : 'submarine'));
    set.addAchievement({
      title: data.title,
      points: data.points,
      description: `Use the ${data.name} and ${suffix}.`,
      conditions: $(
        isNotCheater(),
        usingWeapon(data.id),
        data.fire === 'Regular' && anyEnemyShipTookDamage(),
        data.fire === 'ScoutShip' && usingAerialRecon(),
        data.fire === 'ScoutSub' && usingSonar(),
        data.fire !== 'Regular' && detectedShip(),
      )
    })
  });

  // Damageless cheevos: need alts.
  damagelessData.forEach((data) => {
    const alts = [...Array(6)].reduce((prev: Record<string, ConditionBuilder>, curr, index) => {
      const base = address.playerShipId1 + (index * 4);
      prev['alt' + (index + 1)] = $(
        simpleCurrCompare('Lower4', base, data.shipId),
        simpleCurrCompare('8bit', base + 3, data.health)
      );
      return prev;
    }, {});

    set.addAchievement({
      title: data.title,
      points: data.points,
      description: `Win any round without taking damage on your ${data.name}.`,
      conditions: {
        core: $(
          isNotCheater(),
          simpleCurrCompare('16bit', address.gameState, 0x1e3),
          ...[...Array(6)].map((_, i) => $(
            ['AddSource', 'Delta', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
          )),
          ['', 'Value', '', 0, '>', 'Value', '', 0],
          ...[...Array(6)].map((_, i) => $(
            ['AddSource', 'Mem', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
          )),
          ['', 'Value', '', 0, '=', 'Value', '', 0],
        ),
        ...alts
      }
    })
  });

  // No specials
  set.addAchievement({
    title: 'Charles A. Baker',
    points: 10,
    description: 'Win any round without using any special weapon or ability.',
    conditions: $(
      pauseIf(isCheater()),
      resetIf(simpleCurrCompare('16bit', address.gameState, 0x3f3)),
      andNext(
        simplePrevCompare('16bit', address.gameState, 0x2409, '!='),
        simpleCurrCompare('16bit', address.gameState, 0x2409),
        simpleCurrCompare('8bit', address.playerShotsFired, 0).withLast({ hits: 1 })
      ),
      ...[...Array(6)].map((_, i) => resetIf(andNext(
        simpleCurrCompare('8bit', address.firedWeapon, 0, '!='),
        simpleCurrPrevCmp('8bit', address.enemyShipHp1 + (i * 4), '<')
      ))),
      ...[...Array(10)].map((_, i) => resetIf(andNext(
        simplePrevCompare('8bit', address.firedWeapon + 3 + i, 0xff, '!='),
        simpleCurrCompare('8bit', address.firedWeapon + 3 + i, 0xff),
        ...[...Array(6)].map((_, j) => simpleCurrPrevCmp('8bit', address.playerShipId1 + 3 + (j * 4), '='))
      ))),
      ...[...Array(6)].map((_, i) => $(
        ['AddSource', 'Delta', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
      )),
      ['', 'Value', '', 0, '>', 'Value', '', 0],
      ...[...Array(6)].map((_, i) => $(
        ['AddSource', 'Mem', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
      )),
      ['Trigger', 'Value', '', 0, '=', 'Value', '', 0],
    )
  });

  // Accuracy cheevo
  set.addAchievement({
    title: 'Dudley W. Morton',
    points: 10,
    description: 'Win any round with an accuracy rating of 40% or higher.',
    conditions: {
      core: $(
        isNotCheater(),
        simpleCurrCompare('8bit', address.playerShotsFired, 0, '!='),
        ...[...Array(6)].map((_, i) => $(
          ['AddSource', 'Delta', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
        )),
        ['', 'Value', '', 0, '>', 'Value', '', 0],
        ...[...Array(6)].map((_, i) => $(
          ['AddSource', 'Mem', '8bit', address.enemyShipHp1 + (i * 4), '%', 'Value', '', 0xff]
        )),
        ['', 'Value', '', 0, '=', 'Value', '', 0],
      ),
      alt1: $(
        isRank(0),
        simpleCurrCompare('8bit', address.playerShotsFired, 35, '<='),
      ),
      alt2: $(
        isRank(0).withLast({ cmp: '!=' }),
        isRank(5).withLast({ cmp: '<=' }),
        simpleCurrCompare('8bit', address.playerShotsFired, 37, '<='),
      ),
      alt3: $(
        isRank(5).withLast({ cmp: '>' }),
        simpleCurrCompare('8bit', address.playerShotsFired, 57, '<='),
      )
    }
  })
};

export default makeCheevos;
