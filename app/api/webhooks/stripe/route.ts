import { updateOrderToPaid } from '@/lib/actions/order-actions';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const event = await Stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === 'charge.succeeded') {
    const { object } = event.data;
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: 'COMPLETED',
        email_address: object.billing_details.email as string,
        pricePaid: (object?.amount / 100).toFixed(2),
      },
    });

    return NextResponse.json({
      message: 'Pedido atualizado com sucesso',
    });
  }

  return NextResponse.json({
    message: 'Evento deu errado',
  });
}
