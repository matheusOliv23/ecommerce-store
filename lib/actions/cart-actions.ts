'use server';

import { CartItem } from '@/@types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '@/validation/cart-schema';
import { revalidatePath } from 'next/cache';

const calculateCartPrices = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);

  const taxPrice = round2(itemsPrice * 0.15);

  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) throw new Error('Carrinho não encontrado');

    const session = await auth();

    const userId = session?.user?.id ? session.user.id : undefined;

    const cart = await getMyCart();

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });

    if (!product) throw new Error('Produto não encontrado');

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calculateCartPrices([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} adicionado ao carrinho`,
        item,
      };
    } else {
      const existingItem = (cart.items as CartItem[]).find(
        (x) => x?.productId === item.productId
      );

      if (existingItem) {
        if (product.stock < existingItem.quantity + 1) {
          throw new Error('Produto sem estoque');
        }

        (cart.items as CartItem[]).find(
          (x) => x?.productId === item.productId
        )!.quantity = existingItem.quantity + 1;
      } else {
        if (product.stock < 1) {
          throw new Error('Produto sem estoque');
        }

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items as CartItem[],
          ...calculateCartPrices(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existingItem ? 'atualizado' : 'adicionado'
        } ao carrinho`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  if (!sessionCartId) throw new Error('Carrinho não encontrado');

  const session = await auth();

  const userId = session?.user?.id ? session.user.id : undefined;

  // Pegar o carrinho do banco de dados

  const cart = await prisma.cart.findFirst({
    where: userId
      ? {
          userId,
        }
      : {
          sessionCartId,
        },
  });
  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items,
    itemsPrice: cart.itemsPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Carrinho não encontrado');

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) throw new Error('Produto não encontrado');

    const cart = await getMyCart();
    if (!cart) throw new Error('Carrinho não encontrado');

    const exist = (cart.items as CartItem[]).find(
      (x: CartItem) => x.productId === productId
    );

    if (exist?.quantity === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x: CartItem) => x.productId !== exist.productId
      );
    } else {
      const itemToUpdate = (cart.items as CartItem[]).find(
        (x: CartItem) => x.productId === productId
      );
      if (itemToUpdate && typeof exist?.quantity === 'number') {
        itemToUpdate.quantity = exist.quantity - 1;
      }
    }

    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items as CartItem[],
        ...calculateCartPrices(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} removido do carrinho`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}