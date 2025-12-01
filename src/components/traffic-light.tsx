'use client';

import { cn } from '@/lib/utils';

type TrafficLightProps = {
  activeLight: 'red' | 'yellow' | 'green';
};

const Light = ({ color, active }: { color: string; active: boolean }) => (
  <div
    className={cn(
      'h-24 w-24 rounded-full transition-all duration-300',
      active ? color : 'bg-gray-700 opacity-30'
    )}
  />
);

export function TrafficLight({ activeLight }: TrafficLightProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-gray-900 p-6 shadow-2xl">
      <Light color="bg-red-500 shadow-[0_0_20px_5px_rgba(239,68,68,0.7)]" active={activeLight === 'red'} />
      <Light color="bg-yellow-400 shadow-[0_0_20px_5px_rgba(250,204,21,0.7)]" active={activeLight === 'yellow'} />
      <Light color="bg-green-500 shadow-[0_0_20px_5px_rgba(34,197,94,0.7)]" active={activeLight === 'green'} />
    </div>
  );
}
