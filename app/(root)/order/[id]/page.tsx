import { getOrderById } from '@/lib/actions/order-actions';
import { notFound } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Order Details',
  description: 'Order Details',
};

export default async function OrderDetailsPage(props: {
  params: {
    id: string;
  };
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return <div>page</div>;
}
