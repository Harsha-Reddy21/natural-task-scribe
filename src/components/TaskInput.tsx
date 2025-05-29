import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { parseTaskText } from '@/lib/openai';
import { Task } from '@/types/Task';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TaskInputProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parseDateString = (dateStr: string | undefined): Date | null => {
    if (!dateStr) return null;

    // Convert relative dates to actual dates
    const lowerDateStr = dateStr.toLowerCase();
    if (lowerDateStr.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // If time is specified in the original string, try to parse it
      const timeMatch = dateStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
      if (timeMatch) {
        const [_, hours, minutes, meridiem] = timeMatch;
        let hour = parseInt(hours);
        
        // Convert 12-hour format to 24-hour format if meridiem is present
        if (meridiem) {
          if (meridiem.toLowerCase() === 'pm' && hour < 12) hour += 12;
          if (meridiem.toLowerCase() === 'am' && hour === 12) hour = 0;
        }
        
        tomorrow.setHours(hour, parseInt(minutes), 0, 0);
      } else {
        // If no time specified, set to start of day
        tomorrow.setHours(0, 0, 0, 0);
      }
      
      return tomorrow;
    }

    // Try parsing the date string directly
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      console.log('\n📝 Starting task processing...');
      
      try {
        const parsedData = await parseTaskText(input.trim());
        const date = parseDateString(parsedData.date);
        
        console.log('Parsed data hlsdfkjas:', parsedData);
        // Convert the parsed data to our Task format
        const taskData: Omit<Task, 'id'> = {
          name: parsedData.title || input,
          assignee: parsedData.assignee || 'Unassigned',
          dueDate: parsedData.date || 'No due date',
          priority: parsedData.priority === 'high' ? 'P1' : 
                   parsedData.priority === 'medium' ? 'P2' : 
                   parsedData.priority === 'low' ? 'P3' : 'P3',
          originalText: input
        };

        console.log('\n✅ Final task data:', JSON.stringify(taskData, null, 2));
        console.log('\n✅ Final task data parsedData:', JSON.stringify(parsedData, null, 2));

        onAddTask(taskData);
        setInput('');
        toast({
          title: "Task added successfully",
          description: "Your task has been parsed and added to the list.",
        });
      } catch (error) {
        console.error('\n❌ Error in task input:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('\n🔍 Detailed error:', errorMessage);
        
        toast({
          title: "Error adding task",
          description: `Failed to parse task: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        console.log('\n🏁 Task processing completed');
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="task-input" className="text-sm font-medium text-gray-700">
            Add a new task
          </label>
          <div className="flex gap-2">
            <Input
              id="task-input"
              type="text"
              placeholder='Try: "Finish landing page with John by tomorrow 5pm, high priority"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Parsing...' : 'Add Task'}
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Examples: "Call client tomorrow at 3pm", "Review design with Sarah by tomorrow, high priority"
        </div>
      </form>
    </Card>
  );
};

export default TaskInput;
