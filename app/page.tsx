import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className='flex flex-col gap-2 min-h-screen items-center justify-center bg-background'>
      <div className='text-8xl font-bold text-chart-1'>Voidpet Dungeon</div>
      <div className='text-7xl font-bold text-chart-2'>- Simulator -</div>
      <div className='text-xl font-semibold text-zinc-500 mt-4 mb-4'>
        A wiki & simulator of the mobile game Voidpet Dungeon.
      </div>
      <Button size='lg'>
        Get Started
        <ArrowUpRightIcon />
      </Button>
    </div>
  );
}
