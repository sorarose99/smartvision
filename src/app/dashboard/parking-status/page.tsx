'use client';

import { useState, useEffect, useContext } from 'react';
import { Car, Clock, Wifi, AlertTriangle } from 'lucide-react';
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
import { ParkingAnalysisOutput } from '@/ai/flows/analyze-parking';
import { AnalysisContext } from '@/context/AnalysisContext';

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

const initialParkingData: ParkingAnalysisOutput = {
    totalSpots: 60,
    occupiedSpots: 45,
    availableSpots: 15,
    occupancyRate: 75,
    status: 'busy',
    message: 'Simulated data. Parking is almost full.'
}


export default function ParkingStatusPage() {
  const { parkingAnalysis } = useContext(AnalysisContext);
  const [parkingData, setParkingData] = useState<ParkingAnalysisOutput>(initialParkingData);
  const [isSimulated, setIsSimulated] = useState(true);

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


  useEffect(() => {
      if(parkingAnalysis){
          setParkingData(parkingAnalysis);
          setIsSimulated(false);
      } else {
          setIsSimulated(true);
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
                message: `Simulated data. ${statusMap[status].message}`
              };
            });
          }, 3000); // Update every 3 seconds

          return () => clearInterval(interval);
      }
  }, [parkingAnalysis])

  const { availableSpots, occupancyRate, status, totalSpots, occupiedSpots, message } =
    parkingData;
  const statusInfo = statusMap[status];

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

       {isSimulated && (
        <div className="bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-sm rounded-md p-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Displaying simulated data. Go to the Camera Processor to analyze a real image.
        </div>
      )}

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
            <p className="text-muted-foreground">{message}</p>
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
