'use client';
import { Cart, CartItem } from '@/@types';
import React, { useTransition } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart-actions';
import { toast } from 'sonner';
import { Plus, Minus, Loader } from 'lucide-react';

export default function AddToCart({
  item,
  cart,
}: {
  item: CartItem;
  cart?: Cart;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
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
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast(res.message, {});

      return;
    });
  };

  const existingItem = (cart?.items as CartItem[])?.find(
    (x) => x?.productId === item.productId
  );

  return existingItem ? (
    <div className='flex items-center gap-6 justify-between'>
      <Button type='button' variant={'outline'} onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='w-4 h-4' />
        )}
      </Button>
      <span>{existingItem.quantity}</span>
      <Button
        className=''
        type='button'
        onClick={handleAddToCart}
        variant={'outline'}
      >
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='w-4 h-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button className='w-full text-sm' type='button' onClick={handleAddToCart}>
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <div>
          <Plus className='w-4 h-4' />
          <span className='ml-2'>Adicionar ao carrinho</span>
        </div>
      )}
    </Button>
  );
}
