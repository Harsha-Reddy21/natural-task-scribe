export interface Task {
  id: string;
  name: string;
  assignee: string;
  dueDate: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  originalText: string;
}
