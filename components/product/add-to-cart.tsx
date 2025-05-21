'use client';
import { Cart, CartItem } from '@/@types';
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart-actions';
import { toast } from 'sonner';
import { Plus, Minus } from 'lucide-react';

export default function AddToCart({
  item,
  cart,
}: {
  item: CartItem;
  cart?: Cart;
}) {
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

  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    toast(res.message, {});

    return;
  };

  const existingItem = (cart?.items as CartItem[])?.find(
    (x) => x?.productId === item.productId
  );

  return existingItem ? (
    <div className='flex items-center gap-6 justify-between'>
      <Button type='button' variant={'outline'} onClick={handleRemoveFromCart}>
        <Minus />
      </Button>
      <span>{existingItem.quantity}</span>
      <Button
        className=''
        type='button'
        onClick={handleAddToCart}
        variant={'outline'}
      >
        <Plus />
      </Button>
    </div>
  ) : (
    <Button className='w-full text-sm' type='button' onClick={handleAddToCart}>
      <Plus className='' />
      Adicionar ao carrinho
    </Button>
  );
}
