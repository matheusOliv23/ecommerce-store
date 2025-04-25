import React from 'react';
import ModeToggle from './mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MenuIcon, ShoppingCart, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Menu() {
  return (
    <div className='flex justify-end gap-3'>
      <nav className='hidden md:flex w-full max-w-xs gap-1'>
        <ModeToggle />
        <Button asChild variant={'ghost'}>
          <Link href='/cart'>
            <ShoppingCart />
          </Link>
        </Button>
        <Button asChild>
          <Link href='/sign-in'>
            <User /> Entrar
          </Link>
        </Button>
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side='left' className='flex flex-col items-start'>
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant={'ghost'}>
              <Link href='/cart'>
                <ShoppingCart />{' '}
              </Link>
            </Button>
            <Button asChild>
              <Link href='/sign-in'>
                <User /> Entrar
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
