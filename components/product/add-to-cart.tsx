'use client';
import { CartItem } from '@/@types';
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { addItemToCart } from '@/lib/actions/cart-actions';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export default function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res?.success) {
      toast(res?.message, {
        description: res?.message,
      });

      return;
    }

    toast(res.message, {
      action: {
        label: 'Ver carrinho',
        onClick: () => router.push('/cart'),
      },
    });
  };

  return (
    <Button className='w-full text-sm' type='button' onClick={handleAddToCart}>
      <Plus className='' />
      Adicionar ao carrinho
    </Button>
  );
}
