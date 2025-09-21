'use server';

/**
 * @fileOverview AI-powered tool to generate personalized portfolio project ideas.
 *
 * - generateProjectIdeas - A function that generates portfolio project ideas.
 * - GenerateProjectIdeasInput - The input type for the generateProjectIdeas function.
 * - GenerateProjectIdeasOutput - The return type for the generateProjectIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectIdeasInputSchema = z.object({
  skills: z.string().describe('The skills of the student.'),
  interests: z.string().describe('The interests of the student.'),
  careerGoals: z.string().describe('The career goals of the student.'),
});
export type GenerateProjectIdeasInput = z.infer<typeof GenerateProjectIdeasInputSchema>;

const ProjectIdeaSchema = z.object({
    title: z.string().describe('A catchy and descriptive title for the project idea.'),
    description: z.string().describe('A detailed description of the project idea, including potential features and technologies to use.'),
});

const GenerateProjectIdeasOutputSchema = z.object({
  projectIdeas: z
    .array(ProjectIdeaSchema)
    .describe('A list of personalized portfolio project ideas, each with a title and description.'),
});
export type GenerateProjectIdeasOutput = z.infer<typeof GenerateProjectIdeasOutputSchema>;

export async function generateProjectIdeas(
  input: GenerateProjectIdeasInput
): Promise<GenerateProjectIdeasOutput> {
  return generateProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectIdeasPrompt',
  input: {schema: GenerateProjectIdeasInputSchema},
  output: {schema: GenerateProjectIdeasOutputSchema},
  prompt: `You are an expert career advisor specializing in suggesting portfolio project ideas to students.

You will use the following information to generate project ideas that align with the student's skills, interests and career goals. Generate a list of 3 personalized portfolio project ideas. For each idea, provide a compelling title and a detailed description.

Skills: {{{skills}}}
Interests: {{{interests}}}
Career Goals: {{{careerGoals}}}`,
});

const generateProjectIdeasFlow = ai.defineFlow(
  {
    name: 'generateProjectIdeasFlow',
    inputSchema: GenerateProjectIdeasInputSchema,
    outputSchema: GenerateProjectIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
