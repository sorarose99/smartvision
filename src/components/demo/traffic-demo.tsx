'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TrafficLight } from '@/components/traffic-light';
import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';


const trafficStates = [
  {
    id: 'heavy',
    level: 'heavy',
    image: PlaceHolderImages.find((img) => img.id === 'traffic-high'),
    signal: 'red' as const,
    signage: {
      message: 'Heavy Congestion Detected',
      suggestion: 'Rerouting Recommended',
    },
  },
  {
    id: 'low',
    level: 'low',
    image: PlaceHolderImages.find((img) => img.id === 'traffic-low'),
    signal: 'green' as const,
    signage: {
      message: 'Traffic is Clear',
      suggestion: 'All Routes Open',
    },
  },
];

export function TrafficDemo() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Traffic Analysis Demo</CardTitle>
        <CardDescription>Slide between a heavy traffic scenario and an empty street to see how the AI responds by changing signals and digital signs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
            <CarouselContent>
                {trafficStates.map((state) => {
                    if (!state.image) return null;
                    return (
                        <CarouselItem key={state.id}>
                            <div className="grid md:grid-cols-3 gap-6 items-center p-1">
                                {/* Image */}
                                <div className="md:col-span-1 aspect-video w-full rounded-md bg-muted overflow-hidden relative">
                                    <Image
                                        src={state.image.imageUrl}
                                        alt={state.image.description}
                                        layout="fill"
                                        objectFit="cover"
                                        data-ai-hint={state.image.imageHint}
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                        Live Feed: {state.level === 'heavy' ? 'Intersection A (Heavy)' : 'Intersection B (Empty)'}
                                    </div>
                                </div>

                                {/* Traffic Light */}
                                <div className="md:col-span-1 flex flex-col items-center justify-center gap-4">
                                    <h3 className="font-semibold">AI Controlled Signal</h3>
                                    <TrafficLight activeLight={state.signal} />
                                </div>

                                {/* Digital Signage */}
                                <div className="md:col-span-1">
                                    <div className="bg-gray-900 text-white rounded-lg p-4 text-center border-4 border-black">
                                    {state.level === 'heavy' ? (
                                        <div className="flex items-center justify-center gap-2 mb-2 text-yellow-400 animate-pulse">
                                            <AlertTriangle className="h-6 w-6" />
                                            <h3 className="text-lg font-bold">TRAFFIC ALERT</h3>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 mb-2 text-green-400">
                                            <CheckCircle className="h-6 w-6" />
                                            <h3 className="text-lg font-bold">ALL CLEAR</h3>
                                        </div>
                                    )}
                                    
                                    <div className="bg-black/50 p-3 rounded-md">
                                        <p className="font-semibold text-xl">{state.signage.message}</p>
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mt-1">
                                            <span>{state.signage.suggestion}</span>
                                            {state.level === 'heavy' && <ArrowRight />}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselPrevious className="ml-12"/>
            <CarouselNext className="mr-12" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
