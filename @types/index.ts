import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
} from '@/validation/cart-schema';
import { paymentMethodSchema } from '@/validation/payment';
import { insertProductSchema } from '@/validation/validators';
import { z } from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;