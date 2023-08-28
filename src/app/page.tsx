import { redirect } from 'next/navigation';

import Heading from '@/components/Heading';

export default async function Home() {
  redirect('/list-county');
  return (
    <div>
      <Heading title="Dashboard" />
    </div>
  );
}
