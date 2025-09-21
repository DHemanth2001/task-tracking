import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  className?: string;
}

export function UserAvatar({ name, className }: UserAvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <Avatar className={cn('h-8 w-8', className)}>
      <AvatarFallback className="bg-primary/20 text-primary font-bold">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
