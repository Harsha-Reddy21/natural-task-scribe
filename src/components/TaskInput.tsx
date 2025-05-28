
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { parseNaturalLanguageTask } from '@/utils/taskParser';
import { Task } from '@/types/Task';
import { Plus, Loader2 } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      try {
        const parsedTask = await parseNaturalLanguageTask(input.trim());
        onAddTask(parsedTask);
        setInput('');
      } catch (error) {
        console.error('Error parsing task:', error);
      } finally {
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
              placeholder='Try: "Finish landing page Aman by 11pm 20th June P1"'
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
          Examples: "Call client Rajeev tomorrow 5pm", "Review design Sarah by Friday P2"
        </div>
      </form>
    </Card>
  );
};

export default TaskInput;
