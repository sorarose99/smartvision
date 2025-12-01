'use server';

/**
 * @fileOverview Summarizes past video analysis results (traffic or train) over a specified period, highlighting key trends and anomalies.
 *
 * - summarizeVideoAnalysis - A function that handles the summarization process.
 * - SummarizeVideoAnalysisInput - The input type for the summarizeVideoAnalysis function.
 * - SummarizeVideoAnalysisOutput - The return type for the summarizeVideoAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVideoAnalysisInputSchema = z.object({
  analysisType: z.enum(['traffic', 'train']).describe('The type of analysis to summarize (traffic or train).'),
  startTime: z.number().describe('The start time (unix timestamp) for the period to summarize.'),
  endTime: z.number().describe('The end time (unix timestamp) for the period to summarize.'),
  analysisResults: z.string().describe('The JSON string of analysis results from Firestore.'),
});
export type SummarizeVideoAnalysisInput = z.infer<typeof SummarizeVideoAnalysisInputSchema>;

const SummarizeVideoAnalysisOutputSchema = z.object({
  summary: z.string().describe('A summary of the video analysis results, highlighting key trends and anomalies.'),
});
export type SummarizeVideoAnalysisOutput = z.infer<typeof SummarizeVideoAnalysisOutputSchema>;

export async function summarizeVideoAnalysis(input: SummarizeVideoAnalysisInput): Promise<SummarizeVideoAnalysisOutput> {
  return summarizeVideoAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeVideoAnalysisPrompt',
  input: {schema: SummarizeVideoAnalysisInputSchema},
  output: {schema: SummarizeVideoAnalysisOutputSchema},
  prompt: `You are an expert analyst reviewing video analysis results.

You will receive analysis results for either traffic or train monitoring over a specified period.
Your task is to summarize these results, highlighting key trends, anomalies, and any potential issues.

Analysis Type: {{{analysisType}}}
Start Time: {{{startTime}}}
End Time: {{{endTime}}}
Analysis Results: {{{analysisResults}}}

Provide a concise and informative summary.
`,
});

const summarizeVideoAnalysisFlow = ai.defineFlow(
  {
    name: 'summarizeVideoAnalysisFlow',
    inputSchema: SummarizeVideoAnalysisInputSchema,
    outputSchema: SummarizeVideoAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
