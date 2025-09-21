'use server';

import { suggestTaskAssignment, type SuggestTaskAssignmentInput, type SuggestTaskAssignmentOutput } from '@/ai/flows/suggest-task-assignment';

export async function getTaskAssignmentSuggestion(input: SuggestTaskAssignmentInput): Promise<SuggestTaskAssignmentOutput> {
  try {
    const result = await suggestTaskAssignment(input);
    return result;
  } catch (error) {
    console.error('Error in AI suggestion flow:', error);
    throw new Error('Failed to get task assignment suggestion.');
  }
}
