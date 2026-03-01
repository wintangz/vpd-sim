import { BattleState, CombatUnit } from './model';
import { applyItemPassive } from './passive';

export function advanceOneTurn(battle: BattleState): CombatUnit {
  let actingUnit: CombatUnit | null = null;
  let smallestTime = Infinity;

  for (const unit of battle.units) {
    const timeUntilTurn = (battle.threshold - unit.gauge) / unit.speed;

    if (timeUntilTurn < smallestTime) {
      smallestTime = timeUntilTurn;
      actingUnit = unit;
    }
  }

  if (!actingUnit) {
    throw new Error('');
  }

  battle.time += smallestTime;

  for (const unit of battle.units) {
    unit.gauge += unit.speed * smallestTime;
  }

  actingUnit.gauge -= battle.threshold;

  actingUnit.turnsTaken += 1;

  applyItemPassive(actingUnit);

  battle.totalTurns += 1;

  return actingUnit;
}
