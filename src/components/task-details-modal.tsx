'use client';

import { useState } from 'react';
import type { Task, User, TaskPriority } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: Task;
  users: User[];
  currentUser: User | null;
  onTaskUpdate: (updatedTask: Task) => void;
}

export function TaskDetailsModal({
  isOpen,
  onOpenChange,
  task,
  users,
  currentUser,
  onTaskUpdate,
}: TaskDetailsModalProps) {
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
  const { toast } = useToast();

  const responsibleUser = users.find(u => u.id === task.responsible)?.name || 'Unknown';
  const tagUser = users.find(u => u.id === task.tag)?.name || 'Unknown';

  const handleSave = async () => {
    const newStatus = isCompleted ? 'completed' : task.status === 'completed' ? 'in_progress' : task.status;
    const updatePayload = {
      priority,
      status: newStatus,
    };

    try {
      const updatedTask = await api.put<Task>(`/tasks/${task.id}`, updatePayload);
      if (updatedTask) {
        onTaskUpdate(updatedTask);
        toast({ title: 'Task Updated', description: 'Your changes have been saved.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not save changes.' });
    }
  };

  if (!currentUser) return null;

  const canEdit = currentUser.role === 'admin' || currentUser.id === task.responsible;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>{task.outcome}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Responsible</Label>
              <Input value={responsibleUser} readOnly />
            </div>
            <div>
              <Label>Tag</Label>
              <Input value={tagUser} readOnly />
            </div>
          </div>
           <div>
            <Label>Outcome End Date</Label>
            <Input value={format(new Date(task.endDate), 'PPP')} readOnly />
          </div>
          <div>
            <Label>Priority</Label>
            <Select 
              value={priority} 
              onValueChange={(value: TaskPriority) => setPriority(value)}
              disabled={!canEdit}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completed"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                disabled={!canEdit}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="completed" className={!canEdit ? 'text-muted-foreground' : ''}>
                Mark as Completed
              </Label>
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!canEdit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
