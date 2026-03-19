export interface CombatUnit {
  id: string;
  name: string;
  speed: number;
  gauge: number;
  turnsTaken: number;
  head: string;
  neck: string;
  modifiers: StatModifier[];
}

export interface BattleState {
  units: CombatUnit[];
  totalTurns: number;
  time: number;
  threshold: number;
}

export type PassiveEffect = (unit: CombatUnit) => void;

export type Stat = 'speed';

export type StatModifier = {
  stat: Stat;
  type: 'multiplier' | 'flat';
  value: number;
  duration: number;
  source: string;
};

export type Effect = {
  name: string;
  duration: number;
};
