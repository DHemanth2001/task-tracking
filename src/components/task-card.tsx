import type { Task, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from './user-avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


interface TaskCardProps {
  task: Task;
  users: User[];
  onClick: () => void;
}

export function TaskCard({ task, users, onClick }: TaskCardProps) {
  const responsibleUser = users.find(u => u.id === task.responsible);
  const tagUser = users.find(u => u.id === task.tag);

  const priorityClasses = {
    high: 'border-l-4 border-red-500',
    medium: 'border-l-4 border-orange-500',
    low: 'border-l-4 border-yellow-500',
  };

  const priorityColors: { [key in Task['priority']]: string } = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200',
        priorityClasses[task.priority]
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <p className="font-semibold leading-snug pr-4">{task.outcome}</p>
          {responsibleUser && <UserAvatar name={responsibleUser.name} />}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
            {tagUser && (
                <Badge variant="outline">
                    <UserAvatar name={tagUser.name} className="w-4 h-4 text-xs mr-1.5" />
                    {tagUser.name}
                </Badge>
            )}
            <Badge variant="secondary" className={priorityColors[task.priority]}>{task.priority}</Badge>
           </div>
           <span>{format(new Date(task.endDate), 'MMM d')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
