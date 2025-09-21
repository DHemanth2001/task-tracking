import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
           <div className="flex justify-center items-center gap-2">
            <CheckSquare className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold">TaskZen</CardTitle>
          </div>
          <CardDescription>Registration is currently disabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a demo application. Please use the provided credentials on the login page.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
