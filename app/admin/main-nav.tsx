'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const links = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Produtos',
    href: '/admin/products',
  },
  {
    title: 'Pedidos',
    href: '/admin/orders',
  },
  {
    title: 'Usuários',
    href: '/admin/users',
  },
];

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-4', className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.includes(link.href) ? '' : 'text-muted-foreground'
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
