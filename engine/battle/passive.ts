import { applyHeadPassive } from '../item/head';
import { applyNeckPassive } from '../item/neck';
import { CombatUnit } from './model';

export function applyItemPassive(unit: CombatUnit) {
  if (unit.neck) {
    applyNeckPassive[unit.neck]?.(unit);
  }

  if (unit.head) {
    applyHeadPassive[unit.head]?.(unit);
  }
}
