import { Task } from '@/types/Task';

export function parseNaturalLanguageTask(input: string): Omit<Task, 'id'> {
  console.log('Parsing input:', input);
  
  // Default values
  let name = input;
  let assignee = 'Unassigned';
  let dueDate = 'No due date';
  let dueTime = 'No time specified';
  let priority: 'P1' | 'P2' | 'P3' | 'P4' = 'P3';

  // Extract priority (P1, P2, P3, P4)
  const priorityMatch = input.match(/\b(P[1-4])\b/i);
  if (priorityMatch) {
    priority = priorityMatch[1].toUpperCase() as 'P1' | 'P2' | 'P3' | 'P4';
    input = input.replace(/\b(P[1-4])\b/i, '').trim();
  }

  // Extract time patterns
  const timePatterns = [
    /\b(\d{1,2}):?(\d{0,2})\s*(am|pm)\b/i,
    /\b(\d{1,2})\s*(am|pm)\b/i,
    /\b(\d{1,2}):(\d{2})\b/
  ];

  let timeMatch;
  for (const pattern of timePatterns) {
    timeMatch = input.match(pattern);
    if (timeMatch) {
      dueTime = timeMatch[0];
      input = input.replace(pattern, '').trim();
      break;
    }
  }

  // Extract date patterns
  const datePatterns = [
    /\b(\d{1,2})(st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\b/i,
    /\b(today|tomorrow|yesterday)\b/i,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/,
    /\b(\d{1,2})-(\d{1,2})-(\d{2,4})\b/
  ];

  let dateMatch;
  for (const pattern of datePatterns) {
    dateMatch = input.match(pattern);
    if (dateMatch) {
      dueDate = dateMatch[0];
      input = input.replace(pattern, '').trim();
      break;
    }
  }

  // Extract assignee (look for names after common keywords or capitalized words)
  const assigneePatterns = [
    /\b(by|for|to|assign to|assigned to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /\b([A-Z][a-z]+)\s+(?:by|tomorrow|today|\d)/,
    /\b([A-Z][a-z]+)(?:\s+(?:by|tomorrow|today))/i
  ];

  let assigneeMatch;
  for (const pattern of assigneePatterns) {
    assigneeMatch = input.match(pattern);
    if (assigneeMatch) {
      assignee = assigneeMatch[assigneeMatch.length - 1].trim();
      input = input.replace(pattern, (match) => {
        // Keep the keyword but remove the name
        if (match.toLowerCase().includes('by') || match.toLowerCase().includes('for') || match.toLowerCase().includes('to')) {
          return '';
        }
        return match.replace(assignee, '').trim();
      }).trim();
      break;
    }
  }

  // Clean up task name
  name = input
    .replace(/\b(by|for|to|assign to|assigned to)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If name is empty, use original input
  if (!name) {
    name = input;
  }

  // Format time properly
  if (dueTime !== 'No time specified') {
    dueTime = formatTime(dueTime);
  }

  // Format date properly
  if (dueDate !== 'No due date') {
    dueDate = formatDate(dueDate);
  }

  console.log('Parsed result:', { name, assignee, dueDate, dueTime, priority });

  return {
    name,
    assignee,
    dueDate,
    dueTime,
    priority,
    originalText: input
  };
}

function formatTime(timeStr: string): string {
  const match = timeStr.match(/(\d{1,2}):?(\d{0,2})?\s*(am|pm)?/i);
  if (!match) return timeStr;

  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const period = match[3]?.toLowerCase() || '';

  if (period === 'pm' && hours !== 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}`;
}

function formatDate(dateStr: string): string {
  const today = new Date();
  
  if (dateStr.toLowerCase() === 'today') {
    return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  if (dateStr.toLowerCase() === 'tomorrow') {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // For other dates, try to parse and format them
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return dateStr;
}
