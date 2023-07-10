'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import MenuItem from './MenuItem';

import { cn } from '@/lib/utils';
import { Gauge } from 'lucide-react';

interface MainNavProps {
  className: string;
}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathName = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: Gauge,
        label: 'Dashboard',
        active: pathName === '/',
        href: '/'
      },
      {
        icon: Gauge,
        label: 'Upload',
        active: pathName === '/upload',
        href: '/upload'
      }
    ],
    [pathName]
  );

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {routes.map((item) => (
        <MenuItem key={item.label} {...item} />
      ))}
      <Link
        href="/uploadfiles"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Customers
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Products
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  );
}
