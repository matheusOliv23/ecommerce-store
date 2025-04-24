import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ModeToggle from './mode-toggle';

export default function Header() {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link href='/' className='flex-start'>
            <Image
              src={'/images/logo.svg'}
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority
            />
            <span className='hidden lg:block font-bold text-2xl ml-3'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='space-x-2'>
          <ModeToggle />
          <Button asChild variant={'ghost'}>
            <Link href='/cart'>
              <ShoppingCart />
            </Link>
          </Button>
          <Button asChild variant={'ghost'}>
            <Link href='/sign-in'>
              <User /> Entrar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
