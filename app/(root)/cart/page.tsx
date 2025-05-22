import { getMyCart } from '@/lib/actions/cart-actions';
import React from 'react';
import CartTable from './Partials/cart-table';
import { Cart } from '@/@types';

export const metadata = {
  title: 'Carrinho',
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <div>
      <CartTable cart={cart as Cart} />
    </div>
  );
}
