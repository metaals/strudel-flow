import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface NodeCardProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-72 min-w-72',
  md: 'w-80 min-w-80',
  lg: 'w-96 min-w-96',
};

export function NodeCard({ children, size = 'md', className }: NodeCardProps) {
  return (
    <div className={cn('flex flex-col gap-3 p-3 bg-card text-card-foreground rounded-md', sizeMap[size], className)}>
      {children}
    </div>
  );
}