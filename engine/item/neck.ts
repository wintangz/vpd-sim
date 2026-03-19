import { CombatUnit, PassiveEffect, StatModifier } from '../battle/model';

export const applyNeckPassive: Record<string, PassiveEffect> = {
  anxietyScarf: (unit: CombatUnit) => {
    const bonus = 0.03 * unit.turnsTaken;

    upsertModifier(unit, {
      stat: 'speed',
      type: 'multiplier',
      value: 1 + bonus,
      duration: 1,
      source: 'anxietyScarf',
    });
  },

  rubberRingDonut: (unit: CombatUnit) => {
    if (unit.turnsTaken >= 15) {
      upsertModifier(unit, {
        stat: 'speed',
        type: 'multiplier',
        value: 2,
        duration: 1,
        source: 'rubberRingDonut',
      });
    }
  },
};

function upsertModifier(unit: CombatUnit, mod: StatModifier) {
  unit.modifiers = unit.modifiers.filter((m) => m.source !== mod.source);
  unit.modifiers.push(mod);
}
