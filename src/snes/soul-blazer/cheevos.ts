import {
  define as $,
  AchievementSet,
  Condition,
  ConditionBuilder,
  andNext,
  measured,
  measuredIf,
  once,
  resetIf,
  trigger,
} from '@cruncheevos/core';

import * as commonBuilders from '../../common/builders.js';

import * as builders from './builders.js';
import { Access, address, damagelessData, expData, sealCheevoData, soulCheevoData, stoneCheevoData } from './data.js';

const makeCheevos = (set: AchievementSet): void => {
  for (const data of soulCheevoData) {
    set.addAchievement({
      title: data.title,
      description: `Find a magical soul to ${data.desc}.`,
      points: 3,
      type: data.type || '',
      conditions: $(
        commonBuilders.simpleDeltaCmp(data.size, address.skyCreatures),
        builders.currentMap(data.map),
        builders.playerNamed(),
      ),
    });
  }

  set.addAchievement({
    title: 'Where Are You?',
    points: 2,
    description: 'A girl searches for her lost father, but finds him only in dreams.',
    type: 'progression',
    conditions: $(
      builders.changedMap(0x0e, 0x01),
      ['', 'Mem', 'Bit2', address.lisaDreamGate, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', address.magicBell, '=', 'Value', '', 0],
      builders.playerNamed(),
    ),
  });
  set.addAchievement({
    title: 'The Goat Saw Everything',
    points: 2,
    description: 'Find the hidden Medical Herb in Grass Valley.',
    conditions: $(
      commonBuilders.simpleDeltaCmp('Bit3', address.goatHerb),
      builders.currentMap(0x01),
      builders.playerNamed(),
    ),
  });
  set.addAchievement({
    title: "Kids Don't See Everything",
    points: 5,
    description: 'Find the hidden Strange Bottle in Grass Valley.',
    conditions: $(
      commonBuilders.simpleDeltaCmp('Bit4', address.bottleGrass),
      builders.currentMap(0x01),
      builders.playerNamed(),
    ),
  });

  for (const data of stoneCheevoData) {
    set.addAchievement({
      id: data.id,
      type: data.type || '',
      title: data.title,
      description: data.desc,
      points: data.points,
      conditions: $(
        builders.gotItem(address.inventoryOffset + data.value, data.value),
        builders.currentMap(data.map),
        builders.playerNamed(),
      ),
    });
  }

  set.addAchievement({
    title: 'Evil Vanquished',
    description: 'Defeat Deathtoll and banish evil from this world.',
    points: 25,
    type: 'win_condition',
    conditions: $(
      andNext('once', builders.simpleDeltaToConstant('8bit', address.mapId, 0x7d)),
      once('0xh8a5=100'),
      builders.deltaToZero('8bit', address.deathtollHealth),
      resetIf(andNext(builders.deltaToZero('8bit', address.curHp))),
      builders.currentMap(0x7d, 'Mem', true),
      builders.resetButtonHit(),
      builders.playerNamed(),
    ),
  });

  const mapListBuilder = (maps: number[]): ConditionBuilder => {
    const builders = maps.map((m, i): Condition.Input => {
      const flag: Condition.Flag = i !== maps.length - 1 ? 'OrNext' : '';
      return [flag, 'Mem', '8bit', address.mapId, '=', 'Value', '', m];
    });
    return $(...builders);
  };

  const sourceBuilder = (
    lairs: Access[],
    valueType: Condition.ValueType,
    target: number,
    cmp: Condition.OperatorComparison = '=',
  ) => {
    const builders = lairs.map((v, i): Condition.Input => {
      if (i !== lairs.length - 1) {
        return ['AddSource', valueType, v.size, v.addr];
      }
      return ['', valueType, v.size, v.addr, cmp, 'Value', '', target];
    });
    return $(...builders);
  };

  const SealCheevoBuilder = (title: string, desc: string, maps: number[], lairs: Access[], target: number) => {
    lairs.sort((a, b) => {
      if (a.addr != b.addr) {
        return a.addr < b.addr ? -1 : 1;
      }
      return a.size < b.size ? -1 : 1;
    });
    const minPrev = sourceBuilder(lairs, 'Delta', target - 5, '>=');
    const maxPrev = sourceBuilder(lairs, 'Delta', target - 1, '<=');
    const curr = sourceBuilder(lairs, 'Mem', target);
    set.addAchievement({
      title,
      description: `Seal all monster lairs ${desc}.`,
      points: 5,
      conditions: $(mapListBuilder(maps), minPrev, maxPrev, measured(curr), measuredIf(builders.playerNamed())),
    });
  };

  for (const seal of sealCheevoData) {
    SealCheevoBuilder(seal.title, seal.desc, seal.maps, seal.lairs, seal.target);
  }

  for (const data of damagelessData) {
    set.addAchievement({
      id: data.id,
      badge: data.badge,
      title: data.title,
      description: data.desc,
      points: data.points,
      type: 'missable',
      conditions: $(
        andNext('once', builders.simpleDeltaToConstant('8bit', address.mapId, data.map)),
        builders.lairAlreadySealed(data.lair),
        builders.resetButtonHit(),
        builders.playerDamaged(),
        trigger(builders.sealLair(data.lair)),
      ),
    });
  }
  // Deathtoll Damageless has its own requirements due to no lair.
  set.addAchievement({
    title: 'Destroying Deathtoll',
    description: "Defeat Deathtoll's demon form without getting hit.",
    points: 25,
    conditions: $(
      andNext('once', builders.simpleDeltaToConstant('8bit', address.mapId, 0x7d)),
      once('0xh8a5=100'),
      builders.resetButtonHit(),
      builders.playerDamaged(),
      builders.playerNamed(true),
      trigger(builders.deltaToZero('8bit', 0x8a5)),
    ),
  });

  for (const data of expData) {
    set.addAchievement({
      title: data.title,
      type: data.type || '',
      description: `Reach EXP level ${data.desc}`,
      points: data.points,
      conditions: $(
        commonBuilders.simpleCmpTwoConstants('8bit', address.level, data.prev, data.target),
        builders.playerNamed(),
      ),
    });
  }
};

export default makeCheevos;
