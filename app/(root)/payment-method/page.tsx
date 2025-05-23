import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user-actions';
import React from 'react';
import PaymentMethodForm from './Partials/payment-method-form';
import CheckoutSteps from '@/components/checkout/checkout-steps';

export default async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  return (
    <div>
      <CheckoutSteps currentStep={2} />
      <PaymentMethodForm defaultPaymentMethod={user.paymentMethod as string} />
    </div>
  );
}
