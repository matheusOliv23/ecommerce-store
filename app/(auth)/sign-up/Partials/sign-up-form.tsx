'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React from 'react';

import { signUpUser } from '@/lib/actions/user-actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';

export default function SignUpForm() {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        className='w-full'
        variant='default'
        type='submit'
        disabled={pending}
      >
        {pending ? 'Enviando...' : 'Entrar'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email' className='text-sm font-medium'>
            Nome completo
          </Label>
          <Input id='name' name='name' type='text' autoComplete='name' />
        </div>
        <div>
          <Label htmlFor='email' className='text-sm font-medium'>
            Email
          </Label>
          <Input id='email' name='email' type='email' autoComplete='email' />
        </div>
        <div>
          <Label htmlFor='password' className='text-sm font-medium'>
            Password
          </Label>
          <Input
            id='password'
            name='password'
            type='password'
            autoComplete='password'
          />
        </div>
        <div>
          <Label htmlFor='password' className='text-sm font-medium'>
            Confirme sua senha
          </Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            autoComplete='confirmPassword'
          />
        </div>

        <div>
          <SignUpButton />
          {data && data.success === false && (
            <div className='text-center text-sm mt-2 text-destructive'>
              {data.message}
            </div>
          )}
          <div className='text-sm mt-4 text-center text-muted-foreground'>
            Já tem uma conta?{' '}
            <Link
              href={'/sign-in'}
              target='_self'
              className='link text-primary'
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
