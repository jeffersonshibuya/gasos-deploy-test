'use client';
import { useRouter } from 'next/navigation';

import Heading from './Heading';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

export default function EmptyState({
  title = 'No Files',
  subtitle = '',
  showReset
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
      <Heading center title={title} subtitle={subtitle} />
      <div className="mt-4 w-48">
        {showReset && <button onClick={() => router.push('/')}>Refresh</button>}
      </div>
    </div>
  );
}
