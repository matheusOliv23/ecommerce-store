'use client';
import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/actions/order-actions';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useFormStatus } from 'react-dom';

export default function PlaceOrderForm() {
  const router = useRouter();

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button type='submit' className='w-full' disabled={pending}>
        {pending ? (
          <Loader className='animate-spin w-4 h-4' />
        ) : (
          <Check className='w4 h-4' />
        )}{' '}
        Ir para o pagamento
      </Button>
    );
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form onSubmit={onSubmit} className='w-full'>
      <PlaceOrderButton />
    </form>
  );
}
