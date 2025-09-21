'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockUsers } from '@/lib/mock-data';
import { CheckSquare } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Mock authentication
    const user = mockUsers.find(u => u.email.split('@')[0] === username.toLowerCase());

    if (user) {
      localStorage.setItem('taskzen-user', JSON.stringify(user));
      router.push('/dashboard');
    } else if (username.toLowerCase() === 'admin' && mockUsers.find(u => u.role === 'admin')) {
        const adminUser = mockUsers.find(u => u.role === 'admin');
        localStorage.setItem('taskzen-user', JSON.stringify(adminUser));
        router.push('/dashboard');
    } else if (username.toLowerCase() === 'user' && mockUsers.find(u => u.role === 'user')) {
        const basicUser = mockUsers.find(u => u.role === 'user');
        localStorage.setItem('taskzen-user', JSON.stringify(basicUser));
        router.push('/dashboard');
    } else {
      setError('Invalid username or password. Try "admin" or "user".');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center gap-2">
            <CheckSquare className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold">TaskZen</CardTitle>
          </div>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="admin or user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="any password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Don't have an account?{' '}
            <a href="/register" className="underline hover:text-primary">
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
