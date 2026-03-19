import { BattleState } from '@/engine/battle/model';
import { advanceOneTurn } from '@/engine/battle/battle';

const Test = () => {
  const battle: BattleState = {
    units: [
      {
        id: 'gronk',
        name: 'Gronk',
        speed: 45085,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
        modifiers: [],
      },
      {
        id: 'merry',
        name: 'Merry',
        speed: 44131,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
        modifiers: [],
      },
      {
        id: 'mischief',
        name: 'Mischief',
        speed: 60201,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
        modifiers: [],
      },
      {
        id: 'cringe',
        name: 'Cringe',
        speed: 12224,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
        modifiers: [],
      },
      {
        id: 'jealous',
        name: 'Jealous',
        speed: 39620,
        gauge: 0,
        turnsTaken: 0,
        head: '',
        neck: '',
        modifiers: [],
      },
    ],
    totalTurns: 0,
    time: 0,
    threshold: 1000,
  };

  for (let i = 0; i < 50; i++) {
    advanceOneTurn(battle);
  }
  return <div>Test</div>;
};

export default Test;
