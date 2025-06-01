import { getOrderById } from '@/lib/actions/order-actions';
import { notFound } from 'next/navigation';
import React from 'react';
import OrderDetailsTable from './order-details-table';
import { auth } from '@/auth';
import Stripe from 'stripe';
import ElementsProvider from '@/components/ElementsProvider/elements-provider';

export const metadata = {
  title: 'Order Details',
  description: 'Order Details',
};

export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);
  const session = await auth();

  let client_secret = null;

  if (order?.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'BRL',
      metadata: {
        orderId: order.id,
      },
    });

    client_secret = paymentIntent.client_secret;
  }

  if (!order) notFound();

  return (
    <ElementsProvider client_secret={client_secret}>
      <OrderDetailsTable
        stripeClientSecret={client_secret}
        order={order as any}
        isAdmin={session?.user?.role === 'admin' || false}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      />
    </ElementsProvider>
  );
}
