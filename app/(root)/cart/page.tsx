import { getMyCart } from '@/lib/actions/cart-actions';
import React from 'react';
import CartTable from './Partials/cart-table';

export const metadata = {
  title: 'Carrinho',
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <div>
      <CartTable cart={cart as any} />
    </div>
  );
}
