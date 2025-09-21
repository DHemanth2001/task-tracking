'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  CheckSquare,
  PlusCircle,
  LayoutGrid,
  Archive,
  BookOpen,
  Users,
  LogOut,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@/lib/types';
import { CreateTaskModal } from './create-task-modal';
import { UserAvatar } from './user-avatar';
import { Button } from './ui/button';

export function SidebarNav({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('taskzen-user');
    router.push('/login');
  };

  const menuItems = [
    { href: '/dashboard/priority-matrix', label: 'Priority Matrix', icon: LayoutGrid },
    { href: '/dashboard/backlog', label: 'Backlog', icon: Archive },
    { href: '#', label: 'Trainings', icon: BookOpen, disabled: true },
    { href: '#', label: 'User Permissions', icon: Users, disabled: true },
    { href: '/dashboard/team', label: 'Team Members', icon: Users },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <CheckSquare className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">TaskZen</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {user.role === 'admin' && (
          <div className="p-2">
             <CreateTaskModal />
          </div>
        )}
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={!item.disabled && pathname.startsWith(item.href)}
                  disabled={item.disabled}
                  aria-disabled={item.disabled}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <UserAvatar name={user.name} />
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
