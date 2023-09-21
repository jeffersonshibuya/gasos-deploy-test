import { redirect } from 'next/navigation';

import Heading from '@/components/Heading';

export default async function Home() {
  redirect('/dashboard');
  return (
    <div>
      <Heading title="Dashboard" />
    </div>
  );
}
