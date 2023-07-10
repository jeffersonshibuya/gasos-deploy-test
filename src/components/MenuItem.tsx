import Link from 'next/link';

import { cn } from '@/lib/utils';

interface MenuItemProps {
  icon: any;
  label: string;
  active?: boolean;
  href: string;
}

export default function MenuItem({
  icon: Icon,
  label,
  active,
  href
}: MenuItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        `flex items-center gap-x-2 text-sm font-medium transition`,
        active && 'text-primary',
        !active && 'hover:text-primary'
      )}
    >
      <Icon size={18} />
      <p className="w-full truncate">{label}</p>
    </Link>
  );
}
