'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrafficDemo } from './traffic-demo';
import { ParkingDemo } from './parking-demo';

export function DemoSwitcher() {
  const [demoType, setDemoType] = useState('traffic');

  return (
    <Tabs value={demoType} onValueChange={setDemoType} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="traffic">Traffic Demo</TabsTrigger>
        <TabsTrigger value="parking">Parking Demo</TabsTrigger>
      </TabsList>
      <TabsContent value="traffic">
        <TrafficDemo />
      </TabsContent>
      <TabsContent value="parking">
        <ParkingDemo />
      </TabsContent>
    </Tabs>
  );
}
