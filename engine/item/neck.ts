import { CombatUnit, PassiveEffect } from '../battle/model';

export const applyNeckPassive: Record<string, PassiveEffect> = {
  anxietyScarf: (unit: CombatUnit) => {
    unit.speed = unit.speed * 0.03 * unit.turnsTaken;
  },

  rubberRingDonut: (unit: CombatUnit) => {
    if (unit.turnsTaken >= 15) {
      unit.speed = unit.speed * 2;
    }
  },
};
