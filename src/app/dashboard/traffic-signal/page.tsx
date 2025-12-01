'use client';

import { useState, useEffect } from 'react';
import { TrafficLight } from '@/components/traffic-light';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LightState = 'red' | 'yellow' | 'green';

const lightCycle: { color: LightState; duration: number }[] = [
  { color: 'green', duration: 25 },
  { color: 'yellow', duration: 5 },
  { color: 'red', duration: 30 },
];

export default function TrafficSignalPage() {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [countdown, setCountdown] = useState(lightCycle[0].duration);
  const activeLight = lightCycle[cycleIndex].color;
  const activeDuration = lightCycle[cycleIndex].duration;

  useEffect(() => {
    setCountdown(activeDuration);
  }, [cycleIndex, activeDuration]);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const nextIndex = (cycleIndex + 1) % lightCycle.length;
      setCycleIndex(nextIndex);
    }
  }, [countdown, cycleIndex]);


  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full relative">
      <div className="absolute top-0 right-0">
        <Button variant="outline">
          <Wifi className="mr-2 h-4 w-4" />
          Connect to Device
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Traffic Signal Status</h1>
        <p className="text-muted-foreground">Live simulation of an AI-controlled intersection.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
         <div className="flex items-center justify-center p-4">
             <TrafficLight activeLight={activeLight} />
         </div>
         <Card className="flex flex-col items-center justify-center">
            <CardHeader className="items-center">
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Clock className="h-8 w-8" />
                    Time Remaining
                </CardTitle>
                <CardDescription>Next light change in...</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-8xl font-bold tabular-nums text-primary">
                    {countdown}
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
