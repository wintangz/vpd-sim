import { BattleState } from '@/engine/model';
import { advanceOneTurn } from '@/engine/simulator';

const Test = () => {
  const battle: BattleState = {
    units: [
      {
        id: 'tyrant',
        name: 'Tyrant',
        baseSpeed: 61231,
        speed: 61231,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
      },
      {
        id: 'merry',
        name: 'Merry',
        baseSpeed: 47959,
        speed: 47959,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: 'anxietyScarf',
      },
      {
        id: 'wonder',
        name: 'Wonder',
        baseSpeed: 49714,
        speed: 49714,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: 'rubberRingDonut',
      },
      {
        id: 'cringe',
        name: 'Cringe',
        baseSpeed: 12224,
        speed: 12224,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
      },
    ],
    totalTurns: 0,
    time: 0,
    threshold: 1000,
  };

  for (let i = 0; i < 100; i++) {
    const acted = advanceOneTurn(battle);

    console.log(
      `Turn ${battle.totalTurns}: ${acted.name} (unit turns: ${acted.turnsTaken}, speed: ${acted.speed.toFixed(2)})`,
    );
  }
  return <div>Test</div>;
};

export default Test;
