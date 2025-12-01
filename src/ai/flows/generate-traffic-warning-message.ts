'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating traffic warning messages and suggesting routes.
 * This flow is designed to be used for digital signage based on traffic analysis.
 *
 * - generateTrafficWarningMessage - A function that orchestrates the message generation.
 * - TrafficWarningInput - The input type for the function.
 * - TrafficWarningOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrafficWarningInputSchema = z.object({
  trafficLevel: z
    .string()
    .describe("The current traffic level, e.g., 'heavy', 'moderate', or 'light'."),
  congestionDetails: z
    .string()
    .describe('Specific details about the congestion, such as location and cause (e.g., "Accident on Main St bridge").'),
});
export type TrafficWarningInput = z.infer<typeof TrafficWarningInputSchema>;

const TrafficWarningOutputSchema = z.object({
  message: z.string().describe('A concise warning message suitable for a large digital sign.'),
  suggestedRoute: z
    .string()
    .describe('A clear, step-by-step alternative route to avoid congestion.'),
});
export type TrafficWarningOutput = z.infer<typeof TrafficWarningOutputSchema>;

export async function generateTrafficWarningMessage(
  input: TrafficWarningInput
): Promise<TrafficWarningOutput> {
  return generateTrafficWarningMessageFlow(input);
}

const trafficWarningPrompt = ai.definePrompt({
  name: 'trafficWarningPrompt',
  input: {schema: TrafficWarningInputSchema},
  output: {schema: TrafficWarningOutputSchema},
  prompt: `You are an AI assistant for a smart city traffic management system. Your task is to generate a traffic warning message and a suggested alternative route for a large digital highway sign.
  The message must be clear, concise, and easy to read from a distance. The route should be simple.

  Current Traffic Situation:
  - Traffic Level: {{{trafficLevel}}}
  - Details: {{{congestionDetails}}}

  Based on this, generate the 'message' and 'suggestedRoute' fields.
  Example output for heavy traffic:
  {
    "message": "ACCIDENT AHEAD on I-5 North",
    "suggestedRoute": "Use Exit 12 -> Main St -> Re-enter at Oak Ave"
  }
  `,
});

const generateTrafficWarningMessageFlow = ai.defineFlow(
  {
    name: 'generateTrafficWarningMessageFlow',
    inputSchema: TrafficWarningInputSchema,
    outputSchema: TrafficWarningOutputSchema,
  },
  async input => {
    const {output} = await trafficWarningPrompt(input);
    return output!;
  }
);
