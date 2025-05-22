'use client';
import { Cart } from '@/@types';
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
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart-actions';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

export default function CartTable({ cart }: { cart?: Cart }) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  return (
    <div>
      <h1 className='py-4 h2-bold'>Carrinho de compras</h1>
      {!cart || cart?.items?.length === 0 ? (
        <div>
          Carrinho está vazio.<Link href={'/'}> Ir comprar</Link>{' '}
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantidade</TableHead>
                  <TableHead className='text-right'>Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart?.items?.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className='flex items-center gap-2'>
                      <Link
                        className='flex items-center'
                        href={`/product/${item.slug}`}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          className='w-16 h-16 object-cover'
                          width={50}
                          height={50}
                        />
                        <span className='px-2'>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className=''>
                      <div className='flex-center gap-2'>
                        {' '}
                        <Button
                          disabled={isPending}
                          variant={'outline'}
                          type='button'
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromCart(
                                item.productId
                              );

                              if (res?.success) {
                                toast(res.message, {});
                              }
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className='w-4 h-4 animate-spin' />
                          ) : (
                            <Minus className='w-4 h-4' />
                          )}
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          disabled={isPending}
                          variant={'outline'}
                          type='button'
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);

                              if (res?.success) {
                                toast(res.message, {});
                              }
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className='w-4 h-4 animate-spin' />
                          ) : (
                            <Plus className='w-4 h-4' />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <span>{formatCurrency(item.price)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent>
              <div className='pb-3 text-xl'>
                Total ({cart.items.reduce((a, b) => a + b.quantity, 0)} )
                <span className='font-bold'>
                  :{formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                onClick={() =>
                  startTransition(() => router.push('/shipping-address'))
                }
                className='w-full'
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='h-4 w-4' />
                )}
                Finalizar compra
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
