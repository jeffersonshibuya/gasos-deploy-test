import { redirect } from 'next/navigation';

import LoginForm from './components/LoginForm';

import getCurrentUser from '@/actions/getCurrentUser';

export default async function Login() {
  const currentuser = await getCurrentUser();

  if (currentuser) {
    redirect('/');
  }

  return <LoginForm />;
}
