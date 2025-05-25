export const APP_NAME = 'E-commerce';
export const APP_DESCRIPTION = 'Plataforma de ecommerce';
export const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const PAYMENT_METHODS = ['Stripe', 'PayPal', 'Cash on delivery'];

export const DEFAULT_PAYMENT_METHOD = 'Stripe';

export const PAGE_SIZE = 10;