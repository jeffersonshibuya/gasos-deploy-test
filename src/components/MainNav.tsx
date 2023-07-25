'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import MenuItem from './MenuItem';

import { cn } from '@/lib/utils';
import { Gauge, ImagePlusIcon, LayoutList } from 'lucide-react';

interface MainNavProps {
  className: string;
  currentUser?: any | null;
}

export function MainNav({
  className,
  currentUser = null,
  ...props
}: MainNavProps) {
  const pathName = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: Gauge,
        label: 'Dashboard',
        active: pathName === '/',
        href: '/',
        show: true
      },
      {
        icon: ImagePlusIcon,
        label: 'Upload',
        active: pathName === '/upload',
        href: '/uploads',
        show: !!currentUser
      },
      {
        icon: ImagePlusIcon,
        label: 'Upload - Conversion',
        active: pathName === '/upload',
        href: '/upload',
        show: !!currentUser
      },
      {
        icon: LayoutList,
        label: 'List',
        active: pathName === '/list',
        href: '/list',
        show: !!currentUser
      }
    ],
    [currentUser, pathName]
  );

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {routes
        .filter((item) => item.show === true)
        .map((item) => (
          <MenuItem key={item.label} {...item} />
        ))}
    </nav>
  );
}
