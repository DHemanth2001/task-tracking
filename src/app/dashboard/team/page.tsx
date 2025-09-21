import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function TeamPage() {
  const users = mockUsers;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
      <p className="text-muted-foreground">View details and tasks for each team member.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <Link href={`/dashboard/team/${user.id}`} key={user.id}>
            <Card className="hover:bg-accent hover:border-primary transition-all duration-200 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <UserAvatar name={user.name} />
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
