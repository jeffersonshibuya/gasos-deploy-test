import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BoxProps {
  children: ReactNode;
  className?: string;
}

const Box = ({ children, className }: BoxProps) => {
  return (
    <div className={cn(`h-full w-full rounded-lg`, className)}>{children}</div>
  );
};

export default Box;
