import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function ViewAllProductsButton() {
  return (
    <div className='flex justify-center items-center my-8'>
      <Button size={'lg'} asChild className='px-8 py-4 text-lg font-semibold'>
        <Link href={'/search'}>Ver todos os produtos</Link>
      </Button>
    </div>
  );
}
