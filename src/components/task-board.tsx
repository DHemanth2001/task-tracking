'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Task, User } from '@/lib/types';
import { mockTasks, mockUsers } from '@/lib/mock-data';
import { getTaskStatus } from '@/lib/utils';
import { TaskColumn } from './task-column';
import { TaskDetailsModal } from './task-details-modal';
import { useToast } from '@/hooks/use-toast';
import { isToday } from 'date-fns';

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem('taskzen-user');
    const user = userStr ? JSON.parse(userStr) : null;
    setCurrentUser(user);

    const storedTasks = localStorage.getItem('taskzen-tasks');
    const initialTasks = storedTasks ? JSON.parse(storedTasks) : mockTasks;
    setTasks(initialTasks);
    
    setUsers(mockUsers);

    // Mock notifications
    initialTasks.forEach((task: Task) => {
      if (task.responsible === user?.id) {
        if (isToday(new Date(task.startDate))) {
            toast({ title: 'Task Starting Today', description: `Your task "${task.outcome}" is scheduled to start today.` });
        }
        if (isToday(new Date(task.endDate))) {
            toast({ title: 'Task Due Today', description: `Your task "${task.outcome}" is due today.` });
        }
      }
    });

  }, [toast]);

  const handleTaskUpdate = (updatedTask: Task) => {
    const newTasks = tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
    setTasks(newTasks);
    localStorage.setItem('taskzen-tasks', JSON.stringify(newTasks));
    setIsModalOpen(false);
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const displayedTasks = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') {
      return tasks;
    }
    return tasks.filter(task => task.responsible === currentUser.id);
  }, [currentUser, tasks]);

  const { assigned, inProgress, completed } = useMemo(() => {
    const assigned: Task[] = [];
    const inProgress: Task[] = [];
    const completed: Task[] = [];

    displayedTasks.forEach(task => {
      const status = getTaskStatus(task);
      if (status === 'completed') {
        completed.push(task);
      } else if (status === 'in_progress') {
        inProgress.push(task);
      } else if (status === 'assigned') {
        assigned.push(task);
      }
    });

    return { assigned, inProgress, completed };
  }, [displayedTasks]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn title="Assignment" tasks={assigned} users={users} onTaskClick={handleTaskClick} />
        <TaskColumn title="In Progress" tasks={inProgress} users={users} onTaskClick={handleTaskClick} />
        <TaskColumn title="Completed" tasks={completed} users={users} onTaskClick={handleTaskClick} />
      </div>
      {selectedTask && (
        <TaskDetailsModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          task={selectedTask}
          users={users}
          currentUser={currentUser}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
}
