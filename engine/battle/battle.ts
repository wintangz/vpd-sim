import { applyEffect } from './effect';
import { BattleState, CombatUnit, Stat } from './model';
import { applyItemPassive } from './passive';

export function advanceOneTurn(battle: BattleState): CombatUnit {
  let actingUnit: CombatUnit | null = null;
  let smallestTime = Infinity;

  for (const unit of battle.units) {
    const effectiveSpeed = getEffectiveStat(unit, 'speed');
    const timeUntilTurn = (battle.threshold - unit.gauge) / effectiveSpeed;

    if (timeUntilTurn < smallestTime) {
      smallestTime = timeUntilTurn;
      actingUnit = unit;
    }
    applyItemPassive(unit);
  }

  if (!actingUnit) {
    throw new Error('');
  }

  actingUnit.turnsTaken += 1;

  battle.time += smallestTime;

  for (const unit of battle.units) {
    const effectiveSpeed = getEffectiveStat(unit, 'speed');
    unit.gauge += effectiveSpeed * smallestTime;
  }

  actingUnit.gauge -= battle.threshold;

  if (actingUnit.name === 'Cringe' && actingUnit.turnsTaken === 1) {
    const gronk = battle.units.find((u) => u.name === 'Gronk');
    if (gronk) {
      applyEffect(gronk, { name: 'speedDown', duration: 1 });
    }
  }

  // Player choose action and see stats
  console.log(
    `Turn ${battle.totalTurns + 1}: ${actingUnit.name} ` +
      `(turns: ${actingUnit.turnsTaken}, speed: ${getEffectiveStat(actingUnit, 'speed').toFixed(2)})`,
  );

  // Decrease duration of modifiers and remove expired ones
  actingUnit.modifiers = actingUnit.modifiers
    .map((mod) => ({ ...mod, duration: mod.duration - 1 }))
    .filter((mod) => mod.duration > 0);

  // End of turn
  battle.totalTurns += 1;

  return actingUnit;
}

export function getEffectiveStat(unit: CombatUnit, stat: Stat): number {
  const base = unit[stat];

  let flatBonus = 0;
  let multiplier = 1;

  for (const mod of unit.modifiers) {
    if (mod.stat !== stat) continue;

    if (mod.type === 'flat') {
      flatBonus += mod.value;
    } else if (mod.type === 'multiplier') {
      multiplier *= mod.value;
    }
  }

  return (base + flatBonus) * multiplier;
}
