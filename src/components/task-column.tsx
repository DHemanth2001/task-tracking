import type { Task, User } from '@/lib/types';
import { TaskCard } from './task-card';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  users: User[];
  onTaskClick: (task: Task) => void;
}

export function TaskColumn({ title, tasks, users, onTaskClick }: TaskColumnProps) {
  return (
    <Card className="border-2 border-dashed bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} users={users} onClick={() => onTaskClick(task)} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
