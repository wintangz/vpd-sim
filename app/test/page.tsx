import { BattleState } from '@/engine/battle/model';
import { advanceOneTurn } from '@/engine/battle/battle';

const Test = () => {
  const battle: BattleState = {
    units: [
      {
        id: 'tyrant',
        name: 'Tyrant',
        speed: 61231,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
      },
      {
        id: 'merry',
        name: 'Merry',
        speed: 47959,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: 'anxietyScarf',
      },
      {
        id: 'wonder',
        name: 'Wonder',
        speed: 49714,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: 'rubberRingDonut',
      },
      {
        id: 'cringe',
        name: 'Cringe',
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
