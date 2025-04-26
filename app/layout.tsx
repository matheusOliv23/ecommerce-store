import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import '@/assets/styles/globals.css';
import { API_URL, APP_DESCRIPTION, APP_NAME } from '@/lib/constants';
import { ThemeProvider } from 'next-themes';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(API_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#000000' />
        <meta name='description' content={APP_DESCRIPTION} />
        <meta name='robots' content='index, follow' />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute={'class'}
          defaultTheme={'dark'}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
