'use server';
/**
 * @fileOverview This file defines a Genkit flow for managing traffic signals at multiple intersections.
 * The AI determines the optimal light states to ensure smooth traffic flow and prevent collisions.
 *
 * - manageTrafficFlow - A function that orchestrates the traffic signal management.
 * - TrafficFlowInput - The input type for the function.
 * - TrafficFlowOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LightStateSchema = z.enum(['red', 'yellow', 'green']);
export type LightState = z.infer<typeof LightStateSchema>;

const IntersectionStateSchema = z.object({
  id: z.string().describe('The unique identifier for the intersection.'),
  name: z.string().describe('The common name of the intersection.'),
  lights: z.record(z.string(), LightStateSchema).describe('A map of street directions (North, South, East, West) to their current light state.'),
  trafficLevel: z.enum(['light', 'moderate', 'heavy', 'unknown']).describe('The current traffic level at this intersection.'),
});
export type IntersectionState = z.infer<typeof IntersectionStateSchema>;

const TrafficFlowInputSchema = z.object({
  intersections: z.array(IntersectionStateSchema).describe('An array of all intersection states.'),
});
export type TrafficFlowInput = z.infer<typeof TrafficFlowInputSchema>;

const TrafficFlowOutputSchema = z.object({
    decisions: z.array(z.object({
        intersectionId: z.string().describe("The ID of the intersection to update."),
        streetToMakeGreen: z.string().describe("The name of the street or direction (e.g., 'North', 'East') that should be given a green light."),
        reasoning: z.string().describe("A brief explanation for why this decision was made."),
        duration: z.number().describe("The recommended duration in seconds for the green light, based on traffic."),
    })).describe("An array of decisions for which street direction should be green at each intersection.")
});
export type TrafficFlowOutput = z.infer<typeof TrafficFlowOutputSchema>;


const trafficManagementPrompt = ai.definePrompt({
  name: 'trafficManagementPrompt',
  input: {
    schema: z.object({
      intersectionsJson: z.string(),
    }),
  },
  output: {schema: TrafficFlowOutputSchema},
  prompt: `You are an advanced AI traffic controller for Riyadh, Saudi Arabia, acting like a traffic policeman. Your goal is to optimize traffic flow and ensure safety across multiple intersections by making real-time decisions.
  
  You will be given the current state of all intersections, including their traffic levels and the current state of their traffic lights.

  Analyze the provided intersection data: {{{intersectionsJson}}}

  Your task is to make a decision for each intersection to determine which street direction (North/South or East/West) should have the green light in the next cycle.
  
  Priorities:
  1.  **Safety First:** Prevent collisions. Conflicting directions at an intersection must NOT have green lights simultaneously. If North/South is green, East/West must be red.
  2.  **Efficiency:** Your primary goal is to clear congestion.
      -   **If a street has 'heavy' traffic, you MUST give it a green light.**
      -   **If a street has 'light' or no traffic, it should be red**, unless the opposing direction also has no traffic.
  3.  **Coordination:** Consider the flow between nearby intersections. If a major road like 'King Fahd Rd' is heavy at multiple intersections, try to keep its primary flow direction green if it's safe to do so.
  
  For your decision, for the 'streetToMakeGreen' field, use one of the four cardinal directions: 'North', 'South', 'East', or 'West'. The simulation will handle turning both appropriate lights green (e.g., if you choose 'North', 'South' will also turn green).

  For each decision, provide your reasoning. Explain *why* you are choosing to make a particular direction green. Your reasoning must be in Arabic.
  
  Return your response as a strict JSON object matching the output schema.
  `,
});

const manageTrafficFlowFlow = ai.defineFlow(
  {
    name: 'manageTrafficFlowFlow',
    inputSchema: z.object({
        intersections: z.array(IntersectionStateSchema),
    }),
    outputSchema: TrafficFlowOutputSchema,
  },
  async (input) => {
    const { output } = await trafficManagementPrompt({
        intersectionsJson: JSON.stringify(input.intersections)
    });
    return output!;
  }
);

export async function manageTrafficFlow(
  input: TrafficFlowInput
): Promise<TrafficFlowOutput> {
  return manageTrafficFlowFlow(input);
}
