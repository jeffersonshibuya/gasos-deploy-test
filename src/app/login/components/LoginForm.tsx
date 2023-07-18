'use client';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export default function LoginForm() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* <Button onClick={() => signIn('github')}>Continue with Github</Button> */}
      <Button onClick={() => signIn('cognito')}>Continue with Gasos</Button>
      {/* <Button onClick={() => signIn('google')}>Continue with Google</Button> */}
    </div>
  );
}
