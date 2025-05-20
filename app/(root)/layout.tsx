import Footer from '@/components/shared/Footer/footer';
import Header from '@/components/shared/header';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen flex-col'>
      <Header />
      <main className='flex-1 wrapper'>{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
}
