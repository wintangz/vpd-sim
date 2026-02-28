import { BattleState, CombatUnit } from './model';

function applyItemPassive(unit: CombatUnit) {
  if (unit.neck === 'anxietyScarf') {
    unit.speed += unit.baseSpeed * 0.03;
  }
  if (unit.neck === 'rubberRingDonut' && unit.turnsTaken === 15) {
    unit.speed += unit.baseSpeed;
  }
}

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
