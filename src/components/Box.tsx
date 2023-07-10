import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BoxProps {
  children: ReactNode;
  className?: string;
}

const Box = ({ children, className }: BoxProps) => {
  return (
    <div
      className={cn(`h-fit w-full rounded-lg bg-neutral-900`, className)}
    >
      {children}
    </div>
  );
};

export default Box;
