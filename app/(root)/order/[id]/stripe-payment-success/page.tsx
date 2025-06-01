import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/actions/order-actions';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export default async function SucessPage(props: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    payment_intent: string;
  }>;
}) {
  const { id } = await props.params;
  const { payment_intent } = await props.searchParams;

  const order = await getOrderById(id);

  if (!order) notFound();

  if (order.paymentMethod !== 'Stripe' || order.isPaid) {
    notFound();
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  if (
    paymentIntent.metadata.orderId === null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === 'succeeded';

  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <section className='max-w-4xl w-full mx-auto space-y-8'>
      <article className='flex flex-col gap-6 items-center'>
        <h1 className='h1-bold'>Obrigado pela compra</h1>
        <p>
          Seu pagamento foi processado com sucesso. Você receberá um e-mail de
          confirmação em breve.
        </p>
        <Button asChild>
          <Link href={`/order/${id}`}>Ver Detalhes do Pedido</Link>
        </Button>
      </article>
    </section>
  );
}
