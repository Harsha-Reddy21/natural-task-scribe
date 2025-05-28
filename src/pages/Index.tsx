
import React, { useState } from 'react';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import { Task } from '@/types/Task';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: Date.now().toString() };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Task Manager
          </h1>
          <p className="text-lg text-gray-600">
            Add tasks in natural language and watch them get organized automatically
          </p>
        </div>

        <div className="mb-8">
          <TaskInput onAddTask={handleAddTask} />
        </div>

        <TaskList 
          tasks={tasks} 
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default Index;
