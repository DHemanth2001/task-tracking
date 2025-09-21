import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Task, TaskStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTaskStatus = (task: Task): TaskStatus => {
  if (task.status === 'completed') {
    return 'completed';
  }
  const now = new Date();
  const endDate = new Date(task.endDate);
  const startDate = new Date(task.startDate);

  // Set time to 0 to compare dates only
  now.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  if (now > endDate) {
    return 'backlog';
  }
  if (now >= startDate && now <= endDate) {
    return 'in_progress';
  }
  return 'assigned';
};
