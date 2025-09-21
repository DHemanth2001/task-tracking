'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await api.get<User[]>('/users');
        if (fetchedUsers) {
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading team members...</div>
  }

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
                      <h3 className="text-lg font-semibold">{user.name}</h3>
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
