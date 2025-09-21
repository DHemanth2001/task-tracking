'use client';

import { useState, useEffect } from 'react';
import { mockTasks, mockUsers } from '@/lib/mock-data';
import type { Task, User } from '@/lib/types';
import { getTaskStatus } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function BacklogPage() {
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('taskzen-tasks') || JSON.stringify(mockTasks));
    const filteredTasks = allTasks.filter((task: Task) => getTaskStatus(task) === 'backlog');
    setBacklogTasks(filteredTasks);
    setUsers(mockUsers);
  }, []);

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown';
  };

  const priorityColors: { [key in Task['priority']]: string } = {
    high: 'bg-red-500 hover:bg-red-500',
    medium: 'bg-orange-500 hover:bg-orange-500',
    low: 'bg-yellow-500 hover:bg-yellow-500',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Backlog</h1>
      <p className="text-muted-foreground">Tasks that are past their due date.</p>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overdue Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outcome</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backlogTasks.length > 0 ? (
                backlogTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.outcome}</TableCell>
                    <TableCell>
                       <Badge variant="default" className={`capitalize text-white ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </Badge>
                    </TableCell>
                    <TableCell>{getUserName(task.responsible)}</TableCell>
                    <TableCell>{format(new Date(task.endDate), 'PPP')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No backlog tasks. Great job!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
