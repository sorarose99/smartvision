'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const parkingStates = [
  {
    id: 'busy',
    level: 'busy',
    image: PlaceHolderImages.find((img) => img.id === 'parking-full'),
    occupied: 22,
    total: 30,
    message: 'Lot is becoming full. Limited spots remain.',
    color: 'text-red-500',
  },
  {
    id: 'free',
    level: 'free',
    image: PlaceHolderImages.find((img) => img.id === 'parking-empty'),
    occupied: 19,
    total: 60,
    message: 'Ample spots available.',
    color: 'text-green-500',
  },
];

export function ParkingDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Parking Analysis Demo</CardTitle>
        <CardDescription>
          Slide between different parking scenarios to see the AI analysis update.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {parkingStates.map((state) => {
              if (!state.image) return null;
              const occupancyRate = Math.round(
                (state.occupied / state.total) * 100
              );
              return (
                <CarouselItem key={state.id}>
                  <div className="grid md:grid-cols-2 gap-6 items-center p-1">
                    {/* Image */}
                    <div className="aspect-video w-full rounded-md bg-muted overflow-hidden relative">
                      <Image
                        src={state.image.imageUrl}
                        alt={state.image.description}
                        fill
                        objectFit="cover"
                        data-ai-hint={state.image.imageHint}
                      />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Live Feed:{' '}
                        {state.level === 'busy' ? 'Garage A' : 'Lot B'}
                      </div>
                    </div>

                    {/* Parking Status */}
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Lot Occupancy</CardTitle>
                          <CardDescription>
                            {state.occupied} of {state.total} spots are taken.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <Progress value={occupancyRate} className="h-4" />
                            <span
                              className={cn(
                                'text-2xl font-bold tabular-nums',
                                state.color
                              )}
                            >
                              {occupancyRate}%
                            </span>
                          </div>
                          <p
                            className={cn(
                              'text-sm font-semibold text-center',
                              state.color
                            )}
                          >
                            {state.message}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
