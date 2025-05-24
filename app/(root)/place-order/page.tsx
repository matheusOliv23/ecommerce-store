import { CartItem, ShippingAddress } from '@/@types';
import { auth } from '@/auth';
import CheckoutSteps from '@/components/checkout/checkout-steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMyCart } from '@/lib/actions/cart-actions';
import { getUserById } from '@/lib/actions/user-actions';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import PlaceOrderForm from './Partials/place-order-form';

export const metadata = {
  title: 'Place Order',
  description: 'Place Order',
};

export default async function PlaceOrderPage() {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);
  if (!cart || cart?.items?.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as ShippingAddress;

  return (
    <div>
      <CheckoutSteps currentStep={3} />
      <h1 className='text-2xl py-4'>Detalhes da compra</h1>

      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Endereço de entrega</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city},{' '}
                {userAddress.postalCode} {userAddress.country}
              </p>
              <div className='mt-3'>
                <Link href={'/shipping-address'}>
                  <Button>Editar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Método de pagamento</h2>
              <p>{user.paymentMethod}</p>
              <div className='mt-3'>
                <Link href={'/payment-method'}>
                  <Button>Editar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Carrinho</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className='text-center'>Quantidade</TableHead>
                    <TableHead className='text-right'>Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(cart?.items as CartItem[]).map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          className='flex items-center'
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            height={50}
                            width={50}
                            className='w-16 h-16 object-cover'
                          />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className='text-center'>
                        {item.quantity}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className='mt-3'>
                <Link href={'/cart'}>
                  <Button>Editar</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Itens</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Taxas</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Frete</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className='flex font-bold justify-between'>
                <div>Total da compra</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
