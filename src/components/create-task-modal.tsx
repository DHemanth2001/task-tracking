'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { PlusCircle, CalendarIcon, Sparkles } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { mockUsers, mockTasks } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { getTaskAssignmentSuggestion } from '@/app/actions';
import type { SuggestTaskAssignmentInput } from '@/ai/flows/suggest-task-assignment';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const taskSchema = z.object({
  outcome: z.string().min(1, 'Outcome is required'),
  priority: z.enum(['low', 'medium', 'high']),
  responsible: z.string().min(1, 'Responsible person is required'),
  tag: z.string().min(1, 'Tag is required'),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be on or after the start date',
  path: ['endDate'],
});

type TaskFormData = z.infer<typeof taskSchema>;

export function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<{ userId: string; reason: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
    },
  });

  const onSubmit = (data: TaskFormData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      status: 'assigned' as const,
    };

    const currentTasks = JSON.parse(localStorage.getItem('taskzen-tasks') || JSON.stringify(mockTasks));
    const newTasks = [...currentTasks, newTask];
    localStorage.setItem('taskzen-tasks', JSON.stringify(newTasks));
    
    toast({
      title: 'Task Created!',
      description: `Task "${newTask.outcome}" has been assigned.`,
    });
    
    setIsOpen(false);
    form.reset();
    setAISuggestion(null);
    // This is a mock refresh. In a real app, you'd use state management or refetch.
    window.location.reload(); 
  };
  
  const handleAISuggestion = async () => {
    const outcome = form.getValues('outcome');
    if (!outcome) {
      form.setError('outcome', { type: 'manual', message: 'Please enter an outcome before suggesting.' });
      return;
    }
    
    setIsAISuggesting(true);
    setAISuggestion(null);

    const input: SuggestTaskAssignmentInput = {
      taskDescription: outcome,
      userRoles: mockUsers.map(u => ({ userId: u.id, role: u.role, availability: u.availability, skills: u.skills })),
    };

    try {
      const result = await getTaskAssignmentSuggestion(input);
      setAISuggestion({ userId: result.suggestedUserId, reason: result.reason });
      form.setValue('responsible', result.suggestedUserId);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not get a suggestion. Please try again.',
      });
    } finally {
      setIsAISuggesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusCircle />
          <span>Create Outcome</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Outcome</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="outcome">Outcome</Label>
            <Input id="outcome" {...form.register('outcome')} />
            {form.formState.errors.outcome && <p className="text-sm text-destructive mt-1">{form.formState.errors.outcome.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="responsible">Responsible</Label>
               <div className="flex gap-1">
                 <Controller
                  name="responsible"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select user..." /></SelectTrigger>
                      <SelectContent>
                        {mockUsers.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 <Button type="button" variant="outline" size="icon" onClick={handleAISuggestion} disabled={isAISuggesting}>
                   <Sparkles className={`h-4 w-4 ${isAISuggesting ? 'animate-spin' : ''}`} />
                 </Button>
              </div>
              {form.formState.errors.responsible && <p className="text-sm text-destructive mt-1">{form.formState.errors.responsible.message}</p>}
            </div>
          </div>
           {aiSuggestion && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>AI Suggestion</AlertTitle>
              <AlertDescription>
                {aiSuggestion.reason}
              </AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="tag">Tag</Label>
            <Controller
              name="tag"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select user..." /></SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.tag && <p className="text-sm text-destructive mt-1">{form.formState.errors.tag.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
               <Controller
                name="startDate"
                control={form.control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div>
              <Label>End Date</Label>
               <Controller
                name="endDate"
                control={form.control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover>
                )}
              />
               {form.formState.errors.endDate && <p className="text-sm text-destructive mt-1">{form.formState.errors.endDate.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
