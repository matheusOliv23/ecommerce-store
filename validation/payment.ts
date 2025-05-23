import { PAYMENT_METHODS } from '@/lib/constants';
import { z } from 'zod';
import { currency } from './validators';
import { shippingAddressSchema } from './cart-schema';

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment method is required'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: `Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`,
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: `Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`,
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  quantity: z
    .number()
    .int()
    .nonnegative('Quantity must be a non-negative integer'),
  image: z.string().min(1, 'Product image is required'),
  price: currency,
});