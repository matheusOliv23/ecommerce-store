'use client';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = React.useState(0);

  return (
    <div className='space-y-4'>
      <Image
        src={images[current]}
        alt='Product Image'
        width={1000}
        height={1000}
        priority
        className='rounded-md w-full min-h-[300px] object-cover object-center'
      />
      <div className='flex'>
        {images?.map((image, index) => (
          <div
            className={`${cn(
              'border mr-2 cursor-pointer hover:border-orange-600',
              current === index && 'border-orange-500'
            )}`}
            key={image}
            onClick={() => setCurrent(index)}
          >
            <Image priority src={image} alt='image' width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
}
