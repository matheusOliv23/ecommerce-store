import { Order } from '@/@types';
import { APP_NAME, SENDER_EMAIL } from '@/lib/constants';
import React from 'react';
import { Resend } from 'resend';
import PuchaseReceipt from './puchase-receipt';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Recibo de compra - Pedido #${order.id}`,
    react: <PuchaseReceipt order={order} />,
  });
};
