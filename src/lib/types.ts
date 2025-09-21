export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  availability: string;
  skills: string[];
};

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskStatus = 'assigned' | 'in_progress' | 'completed' | 'backlog';

export type Task = {
  id: string;
  outcome: string;
  priority: TaskPriority;
  responsible: string; // user id
  tag: string; // user id
  startDate: string; // ISO string
  endDate: string; // ISO string
  status: 'assigned' | 'in_progress' | 'completed'; // backlog is a derived status
};
