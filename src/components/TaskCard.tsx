
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/Task';
import { Calendar, Clock, User, Trash2, Edit3, Check, X } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-200';
      case 'P2': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P3': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'P4': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Task Name */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Input
                value={editedTask.name}
                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                className="text-lg font-semibold"
                placeholder="Task name"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
            )}
            <Badge className={`${getPriorityColor(task.priority)} text-xs font-medium`}>
              {task.priority}
            </Badge>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Assignee */}
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              {isEditing ? (
                <Input
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                  placeholder="Assignee"
                  className="text-sm h-8"
                />
              ) : (
                <span>{task.assignee}</span>
              )}
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              {isEditing ? (
                <Input
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  placeholder="Due date"
                  className="text-sm h-8"
                />
              ) : (
                <span>{task.dueDate}</span>
              )}
            </div>

            {/* Due Time */}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              {isEditing ? (
                <Input
                  value={editedTask.dueTime}
                  onChange={(e) => setEditedTask({ ...editedTask, dueTime: e.target.value })}
                  placeholder="Due time"
                  className="text-sm h-8"
                />
              ) : (
                <span>{task.dueTime}</span>
              )}
            </div>
          </div>

          {/* Original Text */}
          <div className="text-xs text-gray-400 italic">
            Original: "{task.originalText}"
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
