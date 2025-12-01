'use client';

import { useState, useEffect, useContext } from 'react';
import { AlertTriangle, ArrowRight, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrafficWarningOutput } from '@/ai/flows/generate-traffic-warning-message';
import { AnalysisContext } from '@/context/AnalysisContext';

const simulatedMessages: TrafficWarningOutput[] = [
    {
        message: "Heavy Congestion on I-5 North",
        suggestedRoute: "Use Hwy 99 -> Express Ln -> Exit 164"
    },
    {
        message: "Moderate Traffic Ahead",
        suggestedRoute: "Stay in right lane for faster flow"
    },
    {
        message: "Traffic is Clear",
        suggestedRoute: "All routes clear. Drive safely."
    },
    {
        message: "Accident reported on Bridge",
        suggestedRoute: "Take Lower Deck -> Port Exit -> Road 6"
    }
];

export default function DigitalSignagePage() {
    const { trafficAnalysis } = useContext(AnalysisContext);
    const [currentMessage, setCurrentMessage] = useState(simulatedMessages[0]);
    const [isSimulated, setIsSimulated] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

     useEffect(() => {
        if(trafficAnalysis) {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentMessage(trafficAnalysis);
                setIsSimulated(false);
                setIsVisible(true);
            }, 500);
        } else {
            setIsSimulated(true);
            const interval = setInterval(() => {
                setIsVisible(false); // Fade out
                setTimeout(() => {
                    setCurrentMessage(prev => {
                        const currentIndex = simulatedMessages.indexOf(prev);
                        const nextIndex = (currentIndex + 1) % simulatedMessages.length;
                        return simulatedMessages[nextIndex];
                    });
                    setIsVisible(true); // Fade in
                }, 1000); // Time for fade-out animation
            }, 8000); // Change message every 8 seconds

            return () => clearInterval(interval);
        }
    }, [trafficAnalysis]);

    const isHeavy = currentMessage.message.toLowerCase().includes('heavy') || currentMessage.message.toLowerCase().includes('accident');

    return (
        <div className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center p-4 z-50">
            <div className="absolute top-6 right-6">
                <Button variant="outline" className="bg-gray-900/50 hover:bg-gray-800 text-white">
                    <Wifi className="mr-2 h-4 w-4" />
                    Connect to Device
                </Button>
            </div>
             {isSimulated && (
                <div className="absolute top-6 left-6 bg-yellow-900/80 border border-yellow-700 text-yellow-200 text-sm rounded-md p-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Displaying simulated data. Go to the Camera Processor to analyze a real image.
                </div>
            )}
            <div className={`transition-opacity duration-1000 w-full max-w-6xl text-center ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-center gap-4 mb-8">
                    <AlertTriangle className={`h-16 w-16 text-yellow-400 ${isHeavy ? 'animate-pulse' : 'opacity-50'}`} />
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
