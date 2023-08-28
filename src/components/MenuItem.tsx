import Link from 'next/link';

import { cn } from '@/lib/utils';

interface MenuItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        `flex items-center gap-x-2 text-sm  transition`,
        active && ' font-semibold text-[#00A3B5]',
        !active && 'hover:text-primary'
      )}
    >
      <Icon size={18} />
      <p className="w-full truncate">{label}</p>
    </Link>
  );
}
