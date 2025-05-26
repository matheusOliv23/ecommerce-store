import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import ProfileForm from './profile-form';

export const metadata = {
  title: 'Profile',
  description: 'User Profile Page',
};

export default async function ProfilePage() {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <article className='max-w-md mx-auto space-y-4'>
        <h2 className='h2-bold'>Perfil</h2>
        <ProfileForm />
      </article>
    </SessionProvider>
  );
}
