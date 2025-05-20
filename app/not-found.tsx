'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Image
        priority
        src={'/images/logo.svg'}
        alt='Not Found'
        width={48}
        height={48}
      />
      <div className='p-6 rounded-lg shadow-md text-center'>
        <h1 className='text-3xl font-bold mb-4'>Not Found</h1>
        <p className='text-destructive'>Could not find the requested page.</p>
        <Button
          variant={'outline'}
          className='mt-4 ml-2'
          onClick={() => (window.location.href = '/')}
        >
          Voltar para Home
        </Button>
      </div>
    </div>
  );
}
