'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a scene from one or two images and a user question.
 * It identifies the context (e.g., parking, traffic) and answers the user's question.
 *
 * - analyzeScene - A function that orchestrates the scene analysis.
 * - AnalyzeSceneInput - The input type for the function.
 * - AnalyzeSceneOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSceneInputSchema = z.object({
  media: z.array(z.string()).describe("An array of one or two media files (images or video frames) as data URIs. Example: ['data:image/jpeg;base64,...']"),
  question: z.string().describe('The user-provided question about the scene.'),
});
export type AnalyzeSceneInput = z.infer<typeof AnalyzeSceneInputSchema>;

const AnalyzeSceneOutputSchema = z.object({
  context: z.string().describe('The determined context of the scene (e.g., "Parking Lot", "Traffic Intersection", "General Scene").'),
  answer: z.string().describe("The AI's answer to the user's question based on the visual information."),
});
export type AnalyzeSceneOutput = z.infer<typeof AnalyzeSceneOutputSchema>;


const analyzeScenePrompt = ai.definePrompt({
    name: 'analyzeScenePrompt',
    input: { schema: AnalyzeSceneInputSchema },
    output: { schema: AnalyzeSceneOutputSchema },
    prompt: `You are a visual analysis expert. You will be given one or two images and a question from a user.
    
    Your tasks are:
    1. Analyze the image(s) to determine the context (e.g., "Parking Lot", "Traffic Intersection", "General Scene").
    2. Provide a clear, detailed answer to the user's question based only on the visual information in the image(s). If two images are provided, consider both in your answer, noting any differences or progression if applicable.

    User Question: {{{question}}}
    
    {{#each media}}
    Image {{@index}}: {{media url=this}}
    {{/each}}
    
    Return your response as a strict JSON object matching the output schema.
    `,
});


const analyzeSceneFlow = ai.defineFlow(
  {
    name: 'analyzeSceneFlow',
    inputSchema: AnalyzeSceneInputSchema,
    outputSchema: AnalyzeSceneOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeScenePrompt(input);
    return output!;
  }
);


export async function analyzeScene(
  input: AnalyzeSceneInput
): Promise<AnalyzeSceneOutput> {
  return analyzeSceneFlow(input);
}
