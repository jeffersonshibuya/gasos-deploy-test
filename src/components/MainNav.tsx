'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import MenuItem from './MenuItem';

import { cn } from '@/lib/utils';
import { Gauge, ImagePlusIcon, LayoutList } from 'lucide-react';

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
        icon: ImagePlusIcon,
        label: 'Upload',
        active: pathName === '/upload',
        href: '/upload'
      },
      {
        icon: LayoutList,
        label: 'List',
        active: pathName === '/list',
        href: '/list'
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
    </nav>
  );
}
