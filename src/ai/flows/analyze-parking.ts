'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing parking lot availability from an image frame.
 * It determines the number of occupied and available spots.
 *
 * - analyzeParking - A function that orchestrates the parking analysis.
 * - ParkingAnalysisInput - The input type for the analyzeParking function.
 * - ParkingAnalysisOutput - The output type for the analyzeParking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParkingAnalysisInputSchema = z.object({
  totalSpots: z.number().describe('The total number of parking spots in the lot.'),
  videoFrame: z.string().describe("A single frame from the video feed as a data URI, with Base64 encoding. Example: 'data:image/jpeg;base64,...'"),
});
export type ParkingAnalysisInput = z.infer<typeof ParkingAnalysisInputSchema>;

const ParkingAnalysisOutputSchema = z.object({
  totalSpots: z.number().describe('The total number of parking spots.'),
  occupiedSpots: z.number().describe('The number of occupied parking spots based on the image analysis.'),
  availableSpots: z.number().describe('The number of available parking spots.'),
  occupancyRate: z.number().describe('The percentage of occupied spots.'),
  status: z
    .enum(['busy', 'moderate', 'free'])
    .describe('The overall status of the parking lot.'),
  message: z.string().describe('A brief summary message about the parking status.'),
});
export type ParkingAnalysisOutput = z.infer<typeof ParkingAnalysisOutputSchema>;

export async function analyzeParking(
  input: ParkingAnalysisInput
): Promise<ParkingAnalysisOutput> {
  return analyzeParkingFlow(input);
}

const parkingAnalysisPrompt = ai.definePrompt({
    name: 'parkingAnalysisPrompt',
    input: { schema: ParkingAnalysisInputSchema },
    output: { schema: ParkingAnalysisOutputSchema },
    prompt: `Analyze the provided image of a parking lot. The lot has a total of {{{totalSpots}}} spots.
    Based on the image, count how many spots are occupied by vehicles.
    
    Image: {{media url=videoFrame}}
    
    Calculate the number of available spots, the occupancy rate, and determine the status ('busy', 'moderate', 'free').
    - 'busy' is for occupancy > 80%.
    - 'moderate' is for occupancy > 40%.
    - 'free' is for occupancy <= 40%.
    
    Provide a concise summary message. Return the result as a strict JSON object.
    `,
});


const analyzeParkingFlow = ai.defineFlow(
  {
    name: 'analyzeParkingFlow',
    inputSchema: ParkingAnalysisInputSchema,
    outputSchema: ParkingAnalysisOutputSchema,
  },
  async (input) => {
    // In a real scenario, you could add a YOLO adapter call here first for performance.
    // For now, we go directly to the generative model.
    const { output } = await parkingAnalysisPrompt(input);
    return output!;
  }
);
