'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import path from 'path';
import React, { useEffect } from 'react';
import { Input } from '../ui/input';

export default function AdminSearch({}) {
  const pathname = usePathname();
  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
    ? '/admin/users'
    : '/admin/products';
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = React.useState(
    searchParams.get('query') || ''
  );

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);

  return (
    <form action={formActionUrl} method='GET'>
      <Input
        type='search'
        placeholder='Pesquisar...'
        name='query'
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className='md:w-[100px] lg:w-[300px]'
      />
      <button className='sr-only ' type='submit'>
        Pesquisar
      </button>
    </form>
  );
}
