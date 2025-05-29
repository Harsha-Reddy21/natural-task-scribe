import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // ⚠️ Note: Use backend proxy in production!
});

// TypeScript interface for the parsed task
export interface ParsedTaskData {
  title?: string;
  assignee?: string;
  date?: string;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
}
const examples=[
    {
        'Input':'Call harsha at 5pm',
        'Output':{
            'title': "Call harsha",
            'assignee': 'Harsha',
            'date': 'today at5pm',
            'priority': 'P3'
        }
    },
    {
        'Input': "Finish report with Alice by tomorrow at 5pm, high priority",
        'Output':{
            'title': "Finish report",
            'assignee': "Alice",
            'date': "tomorrow at 5pm",
            'priority': "P1"
        }
    },
    {
        'Input':'Finish landing page Aman by 11pm 20th June',
        'Output':{
            'title': "Finish landing page",
            'assignee': "Aman",
            'date': "11pm 20th June",
            'priority': "P3"
        }
    },
    {
        'Input': "Call client",
        'Output':{
            'title': "Call client",
            'assignee': null,
            'date': null,
            'priority': "P4"
        }
    }
]

// System prompt to guide the model
const SYSTEM_PROMPT = `You are a task parsing assistant.

Your job is to extract structured task data from natural language input. 
Return a JSON object with the following fields:
- "title": a short title for the task
- "assignee": the name of the person responsible (or null if not provided)
- "date": due date or time in natural language (or null if not specified)
- "priority": one of [P1,P2,P3,P4] if not specified return P3

use this ${JSON.stringify(examples)} to understand the input and output format.
Respond **only with valid JSON**, no commentary or explanation.
`;

// Function to parse the task text using OpenAI
export async function parseTaskText(text: string): Promise<ParsedTaskData> {
  try {
    // Clear console for better visibility
    console.clear();
    
    // Log the start of processing with a clear separator
    console.log('\n==================================');
    console.log('🚀 Starting OpenAI Task Parser');
    console.log('==================================\n');

    // Log the input
    console.log('📝 Input Task:', text);
    console.log('\n----------------------------------\n');

    // Log the system prompt
    console.log('🤖 System Prompt:');
    console.log(SYSTEM_PROMPT);
    console.log('\n----------------------------------\n');

    // Make the API call
    console.log('📡 Calling OpenAI API...\n');
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
      response_format: { type: 'json_object' }
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    // Log the raw response
    console.log('📥 Raw OpenAI Response:');
    console.log(result);
    console.log('\n----------------------------------\n');
    
    // Parse and log the structured result
    const parsedResult = JSON.parse(result) as ParsedTaskData;
    console.log('✨ Parsed Result:');
    console.log(JSON.stringify(parsedResult, null, 2));
    console.log('\n==================================\n');

    return parsedResult;
  } catch (error) {
    // Log any errors with clear formatting
    console.log('\n==================================');
    console.log('❌ Error in OpenAI Task Parser');
    console.log('==================================\n');
    
    if (error instanceof Error) {
      console.error('Error Type:', error.name);
      console.error('Error Message:', error.message);
      if (error.stack) {
        console.error('\nStack Trace:');
        console.error(error.stack);
      }
    } else {
      console.error('Unknown Error:', error);
    }
    
    console.log('\n==================================\n');
    throw error;
  }
}
