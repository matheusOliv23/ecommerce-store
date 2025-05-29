import { getOrderById } from '@/lib/actions/order-actions';
import { notFound } from 'next/navigation';
import React from 'react';
import OrderDetailsTable from './order-details-table';
import { auth } from '@/auth';

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

  if (!order) notFound();

  return (
    <OrderDetailsTable
      order={order as any}
      isAdmin={session?.user?.role === 'admin' || false}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
    />
  );
}
