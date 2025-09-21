import { TaskBoard } from '@/components/task-board';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Manage your team's tasks and outcomes.</p>
      <div className="mt-6">
        <TaskBoard />
      </div>
    </div>
  );
}
