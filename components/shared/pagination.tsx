'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { formatUrlQuery } from '@/lib/utils';

type PaginationProps = {
  page: number;
  totalPages: number;
  urlParamName: string;
};

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (bntType: 'prev' | 'next') => {
    const pageValue = bntType === 'prev' ? page - 1 : page + 1;
    const newUrl = formatUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div className='flex gap-2'>
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-28'
        disabled={page === 1}
        onClick={() => handleClick('prev')}
      >
        Anterior
      </Button>
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-28'
        disabled={page >= totalPages}
        onClick={() => handleClick('next')}
      >
        Próxima
      </Button>
    </div>
  );
}
