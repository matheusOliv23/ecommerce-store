'use client';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementLocale } from '@stripe/stripe-js';
import { useTheme } from 'next-themes';

export default function ElementsProvider({
  children,
  client_secret = '',
}: {
  children: React.ReactNode;
  client_secret?: string | null;
}) {
  const stripePromise = loadStripe(
    (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string) || ''
  );

  const { theme, systemTheme } = useTheme();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: client_secret || undefined,
        appearance: {
          theme:
            theme === 'dark'
              ? 'night'
              : theme === 'light'
              ? 'stripe'
              : systemTheme === 'light'
              ? 'stripe'
              : 'night',
        },
      }}
    >
      {children}
    </Elements>
  );
}
