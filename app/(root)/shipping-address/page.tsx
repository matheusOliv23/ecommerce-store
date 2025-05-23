import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart-actions';
import { getUserById } from '@/lib/actions/user-actions';
import { redirect } from 'next/navigation';
import React from 'react';
import ShippingAdressForm from './Partials/shipping-adress-form';
import CheckoutSteps from '@/components/checkout/checkout-steps';

export const metadata = {
  title: 'Shipping Address',
  description: 'Shipping Address',
};

export default async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart?.items?.length === 0) redirect('/cart');

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps currentStep={1} />
      <ShippingAdressForm address={user.address} />
    </>
  );
}
