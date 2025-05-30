import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,

} from '@/validation/cart-schema';
import {
  insertOrderItemSchema,
  insertOrderSchema,
  paymentMethodSchema,
  paymentResultSchema,
} from '@/validation/payment';
import { updateProfileSchema } from '@/validation/user-schema';
import {
  insertProductSchema,
  insertReviewSchema,
  updateProductSchema,
  updateUserSchema,
} from '@/validation/validators';
import { z } from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
  numReviews: number;
};

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  OrderItem: OrderItem[];
  user: {
    name: string;
    email: string;
  };
};

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type UpdateProduct = z.infer<typeof updateProductSchema>;

export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: {
    name: string;
  };
};