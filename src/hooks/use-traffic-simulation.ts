'use client';
import { useState, useEffect, useCallback } from 'react';
import { Site } from '@/lib/site-data';
import { manageTrafficFlow, IntersectionState } from '@/ai/flows/manage-traffic-flow';
import { generateTrafficWarningMessage } from '@/ai/flows/generate-traffic-warning-message';
import { useToast } from './use-toast';

type ExtendedIntersectionState = IntersectionState & {
    reasoning?: string;
    duration?: number;
}
type IntersectionStates = Record<string, ExtendedIntersectionState>;
type SimulationStatus = 'stopped' | 'running' | 'error';

const SIMULATION_INTERVAL = 60000; // 60 seconds for AI decision
const YELLOW_LIGHT_DURATION = 2000; // 2 seconds for yellow light

export const useTrafficSimulation = (sites: Site[]) => {
  const [intersectionStates, setIntersectionStates] = useState<IntersectionStates | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('stopped');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [digitalSignMessage, setDigitalSignMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize states
  useEffect(() => {
    const initialStates: IntersectionStates = {};
    const trafficSites = sites.filter((s) => s.type === 'traffic');

    trafficSites.forEach((site) => {
      initialStates[site.id] = {
        id: site.id,
        name: site.name,
        lights: {
          'North': 'red',
          'South': 'red',
          'East': 'green',
          'West': 'green',
        },
        trafficLevel: site.quick.status as IntersectionState['trafficLevel'] ?? 'unknown',
        reasoning: "Initial state. East/West flow is green.",
        duration: 30,
      };
    });
    setIntersectionStates(initialStates);
    setSimulationStatus('running');
  }, [sites]);


  const runAiDecision = useCallback(async () => {
    if (!intersectionStates) return;

    // 1. Get traffic decisions from AI
    const currentStates = Object.values(intersectionStates);
    
    try {
      const result = await manageTrafficFlow({ intersections: currentStates });

      // 2. Turn currently green lights to yellow and store AI reasoning
      setIntersectionStates(prev => {
        if(!prev) return null;
        const newStates = {...prev};
        result.decisions.forEach(({ intersectionId, reasoning, duration }) => {
            const current = newStates[intersectionId];
            if(current) {
                Object.keys(current.lights).forEach(street => {
                    if(current.lights[street] === 'green'){
                        current.lights[street] = 'yellow';
                    }
                });
                current.reasoning = reasoning;
                current.duration = duration;
            }
        });
        return newStates;
      });

      // 3. Wait for yellow light duration
      await new Promise(resolve => setTimeout(resolve, YELLOW_LIGHT_DURATION));

      // 4. Apply new AI decisions (set new green, others red)
       setIntersectionStates(prev => {
        if(!prev) return null;
        const newStates = {...prev};
        result.decisions.forEach(({ intersectionId, streetToMakeGreen }) => {
            const current = newStates[intersectionId];
            if(current) {
                const isVertical = streetToMakeGreen === 'North' || streetToMakeGreen === 'South';

                current.lights['North'] = isVertical ? 'green' : 'red';
                current.lights['South'] = isVertical ? 'green' : 'red';
                current.lights['East'] = !isVertical ? 'green' : 'red';
                current.lights['West'] = !isVertical ? 'green' : 'red';
            }
        });
        return newStates;
      });

      setLastUpdated(new Date().toLocaleTimeString());

      // 5. Check for heavy traffic and generate a sign message
      const heavyTrafficSite = result.decisions.find(d => {
          const state = intersectionStates[d.intersectionId];
          return state && state.trafficLevel === 'heavy';
      });

      if (heavyTrafficSite) {
          const siteDetails = sites.find(s => s.id === heavyTrafficSite.intersectionId);
          if (siteDetails) {
            const signResult = await generateTrafficWarningMessage({
                trafficLevel: 'heavy',
                congestionDetails: `Congestion near ${siteDetails.name}.`
            });
            setDigitalSignMessage(signResult.message);
          }
      } else {
          setDigitalSignMessage("All routes clear. Drive safely.");
      }


    } catch (error: any) {
      console.error("AI traffic management failed:", error);
      toast({
        variant: 'destructive',
        title: 'AI Simulation Error',
        description: error.message || 'The AI controller failed to make a decision.',
      });
      setSimulationStatus('error');
    }

  }, [intersectionStates, toast, sites]);


  // Main simulation loop
  useEffect(() => {
    if (simulationStatus !== 'running' || !intersectionStates) {
      return;
    }

    const intervalId = setInterval(runAiDecision, SIMULATION_INTERVAL);

    // Initial run
    runAiDecision();

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationStatus]);


  return { intersectionStates, simulationStatus, lastUpdated, digitalSignMessage };
};
