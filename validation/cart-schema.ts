import { z } from 'zod';
import { currency } from './validators';

export const cartItemSchema = z.object({
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

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart ID is required'),
  userId: z.string().optional().nullable(),
});


export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  streetAddress: z.string().min(3, 'Address is required'),
  city: z.string().min(3, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phoneNumber: z.string().optional(),
});