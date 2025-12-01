'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

const messages = [
    {
        trafficLevel: "heavy",
        message: "Heavy Congestion on I-5 North",
        suggestedRoute: "Use Hwy 99 -> Express Ln -> Exit 164"
    },
    {
        trafficLevel: "moderate",
        message: "Moderate Traffic Ahead",
        suggestedRoute: "Stay in right lane for faster flow"
    },
    {
        trafficLevel: "light",
        message: "Traffic is Clear",
        suggestedRoute: "All routes clear. Drive safely."
    },
    {
        trafficLevel: "heavy",
        message: "Accident reported on Bridge",
        suggestedRoute: "Take Lower Deck -> Port Exit -> Road 6"
    }
];

export default function DigitalSignagePage() {
    const [currentMessage, setCurrentMessage] = useState(messages[0]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false); // Fade out
            setTimeout(() => {
                setCurrentMessage(prev => {
                    const currentIndex = messages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % messages.length;
                    return messages[nextIndex];
                });
                setIsVisible(true); // Fade in
            }, 1000); // Time for fade-out animation
        }, 8000); // Change message every 8 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center p-4 z-50">
            <div className="absolute top-6 right-6">
                <Button variant="outline" className="bg-gray-900/50 hover:bg-gray-800 text-white">
                    <Wifi className="mr-2 h-4 w-4" />
                    Connect to Device
                </Button>
            </div>
            <div className={`transition-opacity duration-1000 w-full max-w-6xl text-center ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-center gap-4 mb-8 animate-pulse">
                    <AlertTriangle className="h-16 w-16 text-yellow-400" />
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-yellow-400">
                        TRAFFIC ALERT
                    </h1>
                </div>

                <div className="bg-black/50 p-8 rounded-lg">
                    <p className="text-4xl md:text-6xl font-semibold mb-6">
                        {currentMessage.message}
                    </p>

                    <div className="border-t-2 border-yellow-400 w-1/2 mx-auto my-8"></div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <h2 className="text-2xl md:text-3xl font-medium text-gray-300">Suggested Route:</h2>
                        <div className="flex items-center gap-2 text-2xl md:text-4xl font-bold text-green-400">
                           {currentMessage.suggestedRoute.split('->').map((part, index) => (
                               <div key={index} className="flex items-center gap-2">
                                   <span>{part.trim()}</span>
                                   {index < currentMessage.suggestedRoute.split('->').length - 1 && <ArrowRight />}
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
            <p className="absolute bottom-4 text-gray-500">SmartVision Digital Signage System</p>
        </div>
    );
}
