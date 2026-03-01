export interface CombatUnit {
  id: string;
  name: string;
  speed: number;
  gauge: number;
  turnsTaken: number;
  head: string;
  neck: string;
}

export interface BattleState {
  units: CombatUnit[];
  totalTurns: number;
  time: number;
  threshold: number;
}

export type PassiveEffect = (unit: CombatUnit) => void;
