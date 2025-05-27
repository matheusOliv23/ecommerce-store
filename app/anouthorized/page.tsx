import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Unauthorized',
  description: 'You are not authorized to view this page.',
};

export default function AnauthorizedPage() {
  return (
    <section className='container justify-center space-y-4 h-[calc(100vh-200px)] mx-auto flex flex-col items-center'>
      <h1 className='h1-bold text-4xl'>Acesso não autorizado</h1>
      <p className='text-muted-foreground'>
        Você não tem permissão para acessar esta página.{' '}
      </p>
      <Button asChild>
        <Link href='/'>Voltar para a página inicial </Link>
      </Button>
    </section>
  );
}
