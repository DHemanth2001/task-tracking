'use server';

/**
 * @fileOverview An AI agent that suggests the most suitable user to assign a task to.
 *
 * - suggestTaskAssignment - A function that suggests a user for task assignment.
 * - SuggestTaskAssignmentInput - The input type for the suggestTaskAssignment function.
 * - SuggestTaskAssignmentOutput - The return type for the suggestTaskAssignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskAssignmentInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be assigned.'),
  userRoles: z.array(z.object({
    userId: z.string().describe('The unique identifier of the user.'),
    role: z.enum(['user', 'admin']).describe('The role of the user (user or admin).'),
    availability: z.string().describe('The availability of the user.'),
    skills: z.array(z.string()).describe('The skills of the user.'),
  })).describe('An array of available users and their roles, availability and skills.'),
});
export type SuggestTaskAssignmentInput = z.infer<typeof SuggestTaskAssignmentInputSchema>;

const SuggestTaskAssignmentOutputSchema = z.object({
  suggestedUserId: z.string().describe('The user ID of the suggested user to assign the task to.'),
  reason: z.string().describe('The reason for suggesting this user.'),
});
export type SuggestTaskAssignmentOutput = z.infer<typeof SuggestTaskAssignmentOutputSchema>;

export async function suggestTaskAssignment(input: SuggestTaskAssignmentInput): Promise<SuggestTaskAssignmentOutput> {
  return suggestTaskAssignmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskAssignmentPrompt',
  input: {schema: SuggestTaskAssignmentInputSchema},
  output: {schema: SuggestTaskAssignmentOutputSchema},
  prompt: `You are a task assignment expert. Given a task description and a list of users with their roles, availability and skills, suggest the most suitable user to assign the task to.

Task Description: {{{taskDescription}}}

Available Users:
{{#each userRoles}}
- User ID: {{{userId}}}, Role: {{{role}}}, Availability: {{{availability}}}, Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

Based on the task description and the available users, which user is the most suitable to assign the task to? Explain your reasoning.

Output the suggested user ID and the reason for your suggestion.`, 
});

const suggestTaskAssignmentFlow = ai.defineFlow(
  {
    name: 'suggestTaskAssignmentFlow',
    inputSchema: SuggestTaskAssignmentInputSchema,
    outputSchema: SuggestTaskAssignmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
