'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import MenuItem from './MenuItem';

import { cn } from '@/lib/utils';
import { LayoutList } from 'lucide-react';

interface MainNavProps {
  className: string;
  currentuser?: any | null;
}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathName = usePathname();

  const routes = useMemo(
    () => [
      // {
      //   icon: Gauge,
      //   label: 'Dashboard',
      //   active: pathName === '/',
      //   href: '/',
      //   show: true
      // },
      {
        icon: LayoutList,
        label: 'List - Public',
        active: pathName === '/list-public',
        href: '/list-public',
        show: true
      },
      {
        icon: LayoutList,
        label: 'List - County',
        active: pathName === '/list-county',
        href: '/list-county',
        show: true
      },
      {
        icon: LayoutList,
        label: 'List - GA SOS',
        active: pathName === '/list-approval',
        href: '/list-approval',
        show: true
      }
      // {
      //   icon: ImagePlusIcon,
      //   label: 'Upload - .zip',
      //   active: pathName === '/upload',
      //   href: '/uploads',
      //   show: !!currentUser
      // },
      // {
      //   icon: ImagePlusIcon,
      //   label: 'Upload - Compression',
      //   active: pathName === '/compress-upload',
      //   href: '/compress-upload',
      //   show: !!currentUser
      // },
      // {
      //   icon: ImagePlusIcon,
      //   label: 'Upload - Conversion',
      //   active: pathName === '/upload',
      //   href: '/upload',
      //   show: !!currentUser
      // },
      // {
      //   icon: ImagePlusIcon,
      //   label: 'Upload - Preview',
      //   active: pathName === '/uploads-preview',
      //   href: '/uploads-preview',
      //   show: !!currentUser
      // },
      // {
      //   icon: ImagePlusIcon,
      //   label: 'Upload - Multipart',
      //   active: pathName === '/upload-multipart-2',
      //   href: '/upload-multipart-2',
      //   show: !!currentUser
      // }
      // {
      //   icon: ImagePlusIcon,
      //   label: 'Upload - Multipart',
      //   active: pathName === '/upload-multipart',
      //   href: '/upload-multipart',
      //   show: !!currentUser
      // }
    ],
    [pathName]
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
