'use server';

import { auth } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { getMyCart } from './cart-actions';
import { getUserById } from './user-actions';
import { insertOrderSchema } from '@/validation/payment';
import { prisma } from '@/db/prisma';
import { CartItem, OrderItem } from '@/@types';
import { convertToPlainObject } from '../utils';

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, message: 'User not authenticated' };
    }
    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, message: 'User not found' };
    }

    const user = await getUserById(userId);

    if (!cart || cart?.items?.length === 0) {
      return { success: false, message: 'Cart is empty', redirectTo: '/cart' };
    }

    if (!user?.address) {
      return {
        success: false,
        message: 'Address not found',
        redirectTo: '/shipping-address',
      };
    }

    if (!user?.paymentMethod) {
      return {
        success: false,
        message: 'Payment method not found',
        redirectTo: '/payment-method',
      };
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });

      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
            price: item.price,
          },
        });
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error('Error creating order');

    return {
      success: true,
      message: 'Order created successfully',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Error creating order' };
  }
}

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      OrderItem: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}
