import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOutUser } from '@/lib/actions/user-actions';
import { User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>
          <User /> Entrar
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? '';

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            <Button
              variant={'ghost'}
              className='rounded-full w-8 h-8 ml-2 flex items-center justify-center bg-gray-200 text-gray-800 hover:bg-gray-300'
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end'>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {session.user?.name}
              </p>
              <p className='text-sm text-muted-foreground font-medium leading-none'>
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href={'/user/profile'} className='w-full'>
              Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'/user/orders'} className='w-full'>
              Histórico de Pedidos
            </Link>
          </DropdownMenuItem>

          {session.user?.role === 'admin' && (
            <DropdownMenuItem>
              <Link href={'/admin/dashboard'} className='w-full'>
                Área Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className='p-0 mb-1'>
            <form action={signOutUser} className='w-full'>
              <Button
                variant='ghost'
                className='w-full h-4 justify-start py-4 px-2'
              >
                Sair
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
