'use client';

import { signIn } from 'next-auth/react';

import Heading from '../Heading';
import { Button } from '../ui/button';
import Modal from './Modal';

import useLoginModal from '@/hooks/useLoginModal';
import { LogIn } from 'lucide-react';

export default function LoginModal() {
  const loginModal = useLoginModal();

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Loging to your account!" />
    </div>
  );

  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <Button
        variant={'default'}
        onClick={() => signIn('cognito')}
        className="gap-2"
      >
        LogIn
        <LogIn size={16} />
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      title="Login"
      // actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={() => console.log('submit')}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
