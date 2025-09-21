'use server';

/**
 * @fileOverview A skill assessment AI agent.
 *
 * - provideSkillAssessment - A function that handles the skill assessment process.
 * - ProvideSkillAssessmentInput - The input type for the provideSkillAssessment function.
 * - ProvideSkillAssessmentOutput - The return type for the provideSkillAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideSkillAssessmentInputSchema = z.object({
  narrative: z
    .string()
    .describe("A narrative provided by the student, detailing their experiences, interests, and skills."),
});
export type ProvideSkillAssessmentInput = z.infer<typeof ProvideSkillAssessmentInputSchema>;

const ProvideSkillAssessmentOutputSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("A list of strengths identified from the student's narrative."),
  areasForImprovement: z
    .array(z.string())
    .describe("A list of areas for improvement identified from the student's narrative."),
});
export type ProvideSkillAssessmentOutput = z.infer<typeof ProvideSkillAssessmentOutputSchema>;

export async function provideSkillAssessment(input: ProvideSkillAssessmentInput): Promise<ProvideSkillAssessmentOutput> {
  return provideSkillAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideSkillAssessmentPrompt',
  input: {schema: ProvideSkillAssessmentInputSchema},
  output: {schema: ProvideSkillAssessmentOutputSchema},
  prompt: `You are an AI career advisor specializing in skill assessment for students.

You will analyze the student's narrative and identify their strengths and areas for improvement.

Narrative: {{{narrative}}}

Strengths:
- A list of strengths identified from the student's narrative.
Areas for Improvement:
- A list of areas for improvement identified from the student's narrative.`,
});

const provideSkillAssessmentFlow = ai.defineFlow(
  {
    name: 'provideSkillAssessmentFlow',
    inputSchema: ProvideSkillAssessmentInputSchema,
    outputSchema: ProvideSkillAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
