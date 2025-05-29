import { Task } from '@/types/Task';
import { parseTaskText } from '@/lib/openai';

/**
 * Parses a natural language task description into structured task data using OpenAI LLM.
 * @param input The natural language task description
 * @returns A Promise resolving to the parsed task data
 */
export async function parseNaturalLanguageTask(input: string): Promise<Omit<Task, 'id'>> {
  try {
    // Use OpenAI LLM to parse the input
    const parsedData = await parseTaskText(input);
    
    // Convert the parsed data to our Task format
    const taskData: Omit<Task, 'id'> = {
      name: parsedData.title || input,
      assignee: parsedData.assignee || 'Unassigned',
      dueDate: formatDate(parsedData.date),
      priority: parsedData.priority === 'high' ? 'P1' : 
               parsedData.priority === 'medium' ? 'P2' : 
               parsedData.priority === 'low' ? 'P3' : 'P3',
      originalText: input
    };

    return taskData;
  } catch (error) {
    console.error('Error in parseNaturalLanguageTask:', error);
    
    // Provide a fallback task if parsing fails
    return {
      name: input,
      assignee: 'Unassigned',
      dueDate: 'No due date',
      priority: 'P3',
      originalText: input
    };
  }
}

/**
 * Helper function to format a date string from the LLM response
 * @param dateStr The date string from LLM
 * @returns Formatted date string
 */
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'No due date';

  // Handle relative dates
  const lowerDateStr = dateStr.toLowerCase();
  if (lowerDateStr.includes('tomorrow')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Try parsing as regular date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return 'No due date';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Helper function to format a date string from the LLM response
 * @param dateStr The date string from LLM
 * @returns Formatted date string or null if invalid
 */
export function formatDateFromLLM(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  // Handle relative dates
  const lowerDateStr = dateStr.toLowerCase();
  if (lowerDateStr.includes('tomorrow')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Parse time if specified (e.g., "tomorrow 3:00 pm")
    const timeMatch = dateStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (timeMatch) {
      const [_, hours, minutes, meridiem] = timeMatch;
      let hour = parseInt(hours);
      
      // Convert 12-hour format to 24-hour format
      if (meridiem) {
        if (meridiem.toLowerCase() === 'pm' && hour < 12) hour += 12;
        if (meridiem.toLowerCase() === 'am' && hour === 12) hour = 0;
      }
      
      tomorrow.setHours(hour, parseInt(minutes), 0, 0);
    } else {
      // Default to start of day if no time specified
      tomorrow.setHours(0, 0, 0, 0);
    }
    
    return tomorrow;
  }

  // Try parsing as regular date
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
} 