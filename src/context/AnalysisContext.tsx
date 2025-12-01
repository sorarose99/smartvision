'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { ParkingAnalysisOutput } from '@/ai/flows/analyze-parking';
import { TrafficWarningOutput } from '@/ai/flows/generate-traffic-warning-message';

// 1. Define the shape of the context data
interface AnalysisContextType {
  parkingAnalysis: ParkingAnalysisOutput | null;
  setParkingAnalysis: (data: ParkingAnalysisOutput | null) => void;
  trafficAnalysis: TrafficWarningOutput | null;
  setTrafficAnalysis: (data: TrafficWarningOutput | null) => void;
}

// 2. Create the context with a default value
export const AnalysisContext = createContext<AnalysisContextType>({
  parkingAnalysis: null,
  setParkingAnalysis: () => {},
  trafficAnalysis: null,
  setTrafficAnalysis: () => {},
});

// 3. Create the provider component
interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  const [parkingAnalysis, setParkingAnalysis] = useState<ParkingAnalysisOutput | null>(null);
  const [trafficAnalysis, setTrafficAnalysis] = useState<TrafficWarningOutput | null>(null);

  const value = {
    parkingAnalysis,
    setParkingAnalysis,
    trafficAnalysis,
    setTrafficAnalysis,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
