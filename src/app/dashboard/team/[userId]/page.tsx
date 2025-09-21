'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Task, User } from '@/lib/types';
import { UserAvatar } from '@/components/user-avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getTaskStatus } from '@/lib/utils';
import { api } from '@/lib/api';

export default function TeamMemberPage() {
  const params = useParams();
  const { userId } = params;

  const [user, setUser] = useState<User | null>(null);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const [userData, allTasks] = await Promise.all([
            api.get<User>(`/users/${userId}`),
            api.get<Task[]>('/tasks')
          ]);
          
          if (userData) {
            setUser(userData);
          }

          if (allTasks) {
            const userTasks = allTasks.filter((task: Task) => task.responsible === userId);
            setAssignedTasks(userTasks);
          }
        } catch (error) {
          console.error("Failed to fetch team member data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userId]);
  
  const priorityColors: { [key in Task['priority']]: string } = {
    high: 'bg-red-500 hover:bg-red-500',
    medium: 'bg-orange-500 hover:bg-orange-500',
    low: 'bg-yellow-500 hover:bg-yellow-500',
  };

  const statusColors: { [key in ReturnType<typeof getTaskStatus>]: string } = {
    assigned: 'bg-blue-500',
    in_progress: 'bg-purple-500',
    completed: 'bg-green-500',
    backlog: 'bg-gray-500',
  };

  if (loading || !user) {
    return <div>Loading or user not found...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <UserAvatar name={user.name} className="w-16 h-16 text-2xl" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Tasks</CardTitle>
          <CardDescription>A list of all tasks assigned to {user.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outcome</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedTasks.length > 0 ? (
                assignedTasks.map(task => {
                  const status = getTaskStatus(task);
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.outcome}</TableCell>
                      <TableCell>
                        <Badge variant="default" className={`capitalize text-white ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`capitalize text-white ${statusColors[status]}`}>
                          {status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(task.endDate), 'PPP')}</TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No tasks assigned to this user.
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
