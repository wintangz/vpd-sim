import { CombatUnit, Effect } from './model';

export function applyEffect(target: CombatUnit, effect: Effect) {
  const duration = effect.duration;

  if (duration <= 0) return;

  const def = effects[effect.name];
  if (!def) {
    console.log(`Unknown effect: ${effect.name}`);
    return;
  }

  def.apply(target, duration);
}

const effects: Record<
  string,
  {
    apply: (unit: CombatUnit, duration: number) => void;
  }
> = {
  speedDown: {
    apply: (unit, duration) => {
      unit.modifiers.push({
        stat: 'speed',
        type: 'multiplier',
        value: 0.75,
        duration,
        source: 'speed_down',
      });
    },
  },

  speedUp: {
    apply: (unit, duration) => {
      unit.modifiers.push({
        stat: 'speed',
        type: 'multiplier',
        value: 1.3,
        duration,
        source: 'speed_up',
      });
    },
  },
};
