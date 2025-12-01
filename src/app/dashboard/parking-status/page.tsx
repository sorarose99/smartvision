'use client';

import { useState, useEffect } from 'react';
import { Car, Clock, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

type ParkingStatus = 'busy' | 'moderate' | 'free';
type StatusInfo = {
  status: ParkingStatus;
  color: string;
  message: string;
};

const statusMap: Record<ParkingStatus, StatusInfo> = {
  free: {
    status: 'free',
    color: 'text-green-500',
    message: 'Many spots available.',
  },
  moderate: {
    status: 'moderate',
    color: 'text-yellow-500',
    message: 'Limited spots available.',
  },
  busy: {
    status: 'busy',
    color: 'text-red-500',
    message: 'Parking is almost full.',
  },
};

// Simulate live data for a parking station
const useParkingData = () => {
  const [parkingData, setParkingData] = useState({
    totalSpots: 60,
    occupiedSpots: 45,
    availableSpots: 15,
    occupancyRate: 75,
    status: 'busy' as ParkingStatus,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setParkingData((prevData) => {
        // Simulate a car leaving or arriving
        const change = Math.random() > 0.5 ? 1 : -1;
        let occupiedSpots = prevData.occupiedSpots + change;

        // Clamp values
        if (occupiedSpots > prevData.totalSpots)
          occupiedSpots = prevData.totalSpots;
        if (occupiedSpots < 0) occupiedSpots = 0;

        const availableSpots = prevData.totalSpots - occupiedSpots;
        const occupancyRate = Math.round(
          (occupiedSpots / prevData.totalSpots) * 100
        );

        let status: ParkingStatus;
        if (occupancyRate > 80) {
          status = 'busy';
        } else if (occupancyRate > 40) {
          status = 'moderate';
        } else {
          status = 'free';
        }

        return {
          ...prevData,
          occupiedSpots,
          availableSpots,
          occupancyRate,
          status,
        };
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return parkingData;
};

export default function ParkingStatusPage() {
  const parkingData = useParkingData();
  const { availableSpots, occupancyRate, status, totalSpots, occupiedSpots } =
    parkingData;
  const statusInfo = statusMap[status];
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    // Set initial time
    setLiveTime(new Date().toLocaleTimeString());

    // Update time every second to keep it live
    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full relative">
      <div className="absolute top-0 right-0">
        <Button variant="outline">
          <Wifi className="mr-2 h-4 w-4" />
          Connect to Device
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Parking Status: Lot A-1
        </h1>
        <p className="text-muted-foreground">
          Live availability from camera analysis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="flex flex-col items-center justify-center p-6">
          <CardHeader className="items-center pb-2">
            <CardTitle className="text-2xl">Available Spots</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div
              className={cn(
                'text-9xl font-extrabold tabular-nums',
                statusInfo.color
              )}
            >
              {availableSpots}
            </div>
            <p className="text-muted-foreground">{statusInfo.message}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lot Occupancy</CardTitle>
            <CardDescription>
              {occupiedSpots} of {totalSpots} spots are taken.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Progress value={occupancyRate} className="h-4" />
              <span
                className={cn(
                  'text-2xl font-bold tabular-nums',
                  statusInfo.color
                )}
              >
                {occupancyRate}%
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground/50 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {liveTime && <span>Live update: {liveTime}</span>}
      </p>
    </div>
  );
}
