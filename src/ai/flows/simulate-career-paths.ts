'use server';

/**
 * @fileOverview Simulates potential career trajectories based on a student's skills and interests.
 *
 * - simulateCareerPaths - A function that simulates career paths.
 * - SimulateCareerPathsInput - The input type for the simulateCareerPaths function.
 * - SimulateCareerPathsOutput - The return type for the simulateCareerPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateCareerPathsInputSchema = z.object({
  skillsAndInterests: z
    .string()
    .describe("A detailed description of the student's skills and interests."),
});
export type SimulateCareerPathsInput = z.infer<typeof SimulateCareerPathsInputSchema>;

const SimulateCareerPathsOutputSchema = z.object({
  careerPaths: z
    .array(z.string())
    .describe("A list of potential career paths based on the student's skills and interests."),
  summary: z
    .string()
    .describe("A summary of the career paths, including potential steps and milestones."),
});
export type SimulateCareerPathsOutput = z.infer<typeof SimulateCareerPathsOutputSchema>;

export async function simulateCareerPaths(
  input: SimulateCareerPathsInput
): Promise<SimulateCareerPathsOutput> {
  return simulateCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateCareerPathsPrompt',
  input: {schema: SimulateCareerPathsInputSchema},
  output: {schema: SimulateCareerPathsOutputSchema},
  prompt: `You are a career advisor for students in India. You will simulate potential career trajectories based on the student's skills and interests.

Skills and Interests: {{{skillsAndInterests}}}

Consider various factors such as the current job market, educational opportunities, and industry trends in India.

Please provide a list of potential career paths and a summary of the career paths, including potential steps and milestones.`,
});

const simulateCareerPathsFlow = ai.defineFlow(
  {
    name: 'simulateCareerPathsFlow',
    inputSchema: SimulateCareerPathsInputSchema,
    outputSchema: SimulateCareerPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
