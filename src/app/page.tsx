import { redirect } from 'next/navigation';

import Heading from '@/components/Heading';

export default async function Home() {
  redirect('/list-public');
  return (
    <div>
      <Heading title="Dashboard" />
    </div>
  );
}
