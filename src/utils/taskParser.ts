
import { Task } from '@/types/Task';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export async function parseNaturalLanguageTask(input: string): Promise<Omit<Task, 'id'>> {
  console.log('Parsing input with OpenAI:', input);
  
  const prompt = `Parse the following task description and extract information in JSON format.

Task: "${input}"

Extract the following information:
- name: The main task description (remove assignee and date/time from this)
- assignee: Person's name who should do the task (if not specified, use "Unassigned")
- dueDate: Date in format "Day, Month DD, YYYY" (if not specified, use "No due date")
- dueTime: Time in 24-hour format "HH:MM" (if not specified, use "No time specified")
- priority: P1, P2, P3, or P4 (if not specified, use "P3")

Return ONLY valid JSON in this exact format:
{
  "name": "task name here",
  "assignee": "person name or Unassigned",
  "dueDate": "formatted date or No due date", 
  "dueTime": "HH:MM or No time specified",
  "priority": "P1|P2|P3|P4"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a task parser. Return only valid JSON without any additional text or formatting."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;
    console.log('OpenAI response:', response);
    
    if (response) {
      const parsedData = JSON.parse(response);
      console.log('Parsed result:', parsedData);
      
      return {
        name: parsedData.name || input,
        assignee: parsedData.assignee || 'Unassigned',
        dueDate: parsedData.dueDate || 'No due date',
        dueTime: parsedData.dueTime || 'No time specified',
        priority: parsedData.priority || 'P3',
        originalText: input
      };
    }
  } catch (error) {
    console.error('Error parsing with OpenAI:', error);
    
    // Fallback to basic parsing if OpenAI fails
    return {
      name: input,
      assignee: 'Unassigned',
      dueDate: 'No due date',
      dueTime: 'No time specified',
      priority: 'P3',
      originalText: input
    };
  }

  // Default fallback
  return {
    name: input,
    assignee: 'Unassigned', 
    dueDate: 'No due date',
    dueTime: 'No time specified',
    priority: 'P3',
    originalText: input
  };
}
