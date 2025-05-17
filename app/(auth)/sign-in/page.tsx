import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import CredentialsLoginForm from './Partials/credentials-login-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await props.searchParams;

  if (session) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className='w-full max-w-md mx-auto p-4'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href={'/'} className='flex-center'>
            <Image
              src={'/images/logo.svg'}
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority
            />
          </Link>
        </CardHeader>
        <CardDescription className='text-center'>
          Entre com seu email e senha para acessar sua conta.
        </CardDescription>
        <CardContent className='space-y-4'>
          <div>
            <CredentialsLoginForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
