'use server';
import { auth } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { getMyCart } from './cart-actions';
import { getUserById } from './user-actions';
import { insertOrderSchema } from '@/validation/payment';
import { prisma } from '@/db/prisma';
import { CartItem, PaymentResult, ShippingAddress } from '@/@types';
import { convertToPlainObject, formatError } from '../utils';
import { paypal } from '../payments/paypal';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '../generated/prisma/default';
import { sendPurchaseReceipt } from '@/email';

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, message: 'Usuário não autenticado' };
    }
    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    const user = await getUserById(userId);

    if (!cart || cart?.items?.length === 0) {
      return { success: false, message: 'Carrinho vazio', redirectTo: '/cart' };
    }

    if (!user?.address) {
      return {
        success: false,
        message: 'Endereço de entrega não encontrado',
        redirectTo: '/shipping-address',
      };
    }

    if (!user?.paymentMethod) {
      return {
        success: false,
        message: 'Método de pagamento não encontrado',
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

    const insertedOrderId = await prisma.$transaction(async (tx: any) => {
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
      message: 'Pedido criado com sucesso',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
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

export async function createPaypalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          status: '',
          pricePaid: 0,
          email_address: '',
        },
      },
    });

    return {
      success: true,
      message: 'Pedido Paypal criado com sucesso',
      data: paypalOrder.id,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function approvedPayPalOrder(
  orderId: string,
  data: {
    orderID: string;
  }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error capturing PayPal order');
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
        email_address: captureData.payer.email_address,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Pagamento aprovado com sucesso',
      data: captureData,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      OrderItem: true,
    },
  });

  if (!order) throw new Error('Order not found');
  if (order.isPaid) throw new Error('Order already paid');
  if (order.paymentResult)
    throw new Error('Order already has a payment result');

  await prisma.$transaction(async (tx: any) => {
    for (const item of order.OrderItem) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: -item.quantity,
          },
        },
      });
    }

    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      OrderItem: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Error updating order');

  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      user: {
        name: updatedOrder.user?.name ?? '',
        email: updatedOrder.user?.email ?? '',
      },
    },
  });
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page = 1,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) {
    return { success: false, message: 'User not authenticated' };
  }
  const data = await prisma.order.findMany({
    where: {
      userId: session?.user?.id!,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: {
      userId: session?.user?.id!,
    },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function getOrdersSummary() {
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      isPaid: true,
    },
  });

  const pendingSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      isPaid: false,
    },
  });

  // prettier-ignore
  const salesDataRaw = await prisma.$queryRaw<Array<{ month: string;  totalSales: Prisma.Decimal}>>`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData = salesDataRaw.map((item) => ({
    month: item.month,
    totalSales: Number(item.totalSales),
  }));

  const latestSales = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 5,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
    pendingSales,
  };
}

export async function getAllOrders({
  limit = PAGE_SIZE,
  page = 1,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: { select: { name: true } },
      OrderItem: true,
    },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Pedido excluído com sucesso',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateOrderToPaidCashOnDelivery(orderId: string) {
  try {
    await updateOrderToPaid({
      orderId,
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Pedido atualizado para pago com sucesso',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    if (!order.isPaid) {
      throw new Error('Order is not paid yet');
    }

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Pedido entregue com sucesso',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}