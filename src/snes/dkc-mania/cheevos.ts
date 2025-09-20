import { define as $, AchievementSet, andNext, measured, measuredIf, orNext, resetIf } from "@cruncheevos/core";
import { address, bonusRoomData, kongLetterData, progressionCheevoData } from "./data.js";
import { gotAllLetters, inGame, inLevel, inStage, inStageFromMap, isBossDefeated } from "./builders.js";
import { simpleCurrCompare, simplePrevCompare } from "../../common/builders.js";

const makeCheevos = (set: AchievementSet) => {
  progressionCheevoData.forEach((data, index) => {
    set.addAchievement({
      title: data.title,
      points: data.points,
      description: `Beat the boss of ${data.world}.`,
      type: data.type,
      id: 423323 + index,
      conditions: $(
        inStageFromMap(data.roomId),
        inLevel(),
        isBossDefeated(data.battleMusicId),
      ),
    })
  });

  kongLetterData.forEach((data, index) => {
    const suffix = data.title.includes('Tree') ? ' (skip Forest Mayhem)' : '';
    set.addAchievement({
      title: data.title,
      points: 10,
      description: `Complete KONG in every level from ${data.world} in one session${suffix}.`,
      id: 423330 + index,
      conditions: $(
        ...data.stages.map(stage => {
          const stageCondition = (typeof stage === 'number') ? inStageFromMap(stage) : orNext(
            inStageFromMap(stage[0]),
            inStageFromMap(stage[1])
          );
          return andNext(
            stageCondition,
            gotAllLetters(),
          )
        }),
        measured('0=1').withLast({ hits: data.stages.length }),
        measuredIf(simpleCurrCompare('8bit', address.currentKong, 0, '!=')),
        resetIf(simpleCurrCompare('8bit', address.musicId, 0x09))
      )
    })
  });

  bonusRoomData.forEach((data) => {
    const bonusEntries = data.rooms.flatMap(room =>
      room[1].flatMap(r => $(['AddSource', 'Delta', r, room[0]]))
    );
    set.addAchievement({
      title: data.title,
      points: 10,
      description: `Find every bonus room in ${data.world}.`,
      conditions: $(
        ...bonusEntries,
        ['', 'Value', '', 0, '=', 'Value', '', bonusEntries.length - 1],
        ...bonusEntries.map((e) => e.withLast({ lvalue: { type: 'Mem' } })),
        ['Measured', 'Value', '', 0, '=', 'Value', '', bonusEntries.length],
        measuredIf(inGame())
      )
    });
  });

  const stageClears = Object.values(address.stageData).map((addr) => $(['AddSource', 'Delta', 'Bit0', addr]));

  const allBits = stageClears.concat(bonusRoomData.flatMap(data => data.rooms.flatMap(room =>
    room[1].flatMap(r => $(['AddSource', 'Delta', r, room[0]]))
  )));

  set.addAchievement({
    title: 'Maximum Mania',
    id: 423341,
    description: 'Get 101%.',
    points: 25,
    conditions: $(
      ...allBits,
      ['', 'Value', '', 0, '=', 'Value', '', allBits.length - 1],
      ...allBits.map((e) => e.withLast({ lvalue: { type: 'Mem' } })),
      ['Measured', 'Value', '', 0, '=', 'Value', '', allBits.length],
      measuredIf(inGame())
    )
  });
};

export default makeCheevos;
