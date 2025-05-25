'use client';
import { Order, OrderItem } from '@/@types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  approvedPayPalOrder,
  createPaypalOrder,
} from '@/lib/actions/order-actions';
import { toast } from 'sonner';

export default function OrderDetailsTable({
  order,
  paypalClientId,
}: {
  order: Order;
  paypalClientId: string;
}) {
  const {
    shippingAddress,
    OrderItem,
    paidAt,
    deliveredAt,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    let status = '';

    if (isPending) {
      status = 'Aguarde...';
    } else if (isRejected) {
      status = 'Erro ao carregar o PayPal';
    }

    return status;
  };

  const handleCreatePaypalOrder = async () => {
    const res = await createPaypalOrder(order.id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    return res.data;
  };

  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    const res = await approvedPayPalOrder(order.id, data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success('Pagamento realizado com sucesso');
  };

  console.log('databaseUlrl', process.env.DATABASE_URL);
  console.log('paypalClientId', process.env.PAYPAL_CLIENT_ID);
  console.log('paypalapi', process.env.PAYPAL_API_URL);
  
  

  return (
    <div>
      <h1 className='py-4 text-2xl'>Pedido {formatId(order.id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card className='px-0'>
            <CardContent className='gap-4'>
              <h2 className='text-xl pb-4'>Método de Pagamento</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>
                  Pago em {formatDateTime(paidAt!).dateTime}{' '}
                </Badge>
              ) : (
                <Badge variant='destructive'>Não Pago</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='gap-4'>
              <h2 className='text-xl pb-4'>Endereço de entrega</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <Badge variant='secondary' className='text-green-500'>
                  Entregue em {formatDateTime(deliveredAt!).dateTime}{' '}
                </Badge>
              ) : (
                <Badge variant='destructive'>Não entregue</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className='text-xl'>Itens do pedido</h2>
            </CardContent>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantidade</TableHead>
                  <TableHead className='text-right'>Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(OrderItem as OrderItem[])?.map((item) => (
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
          </Card>
        </div>
        <div className='mt-6 md:mt-0'>
          <Card className='w-full'>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Itens</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Taxas</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Frete</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className='flex font-bold justify-between'>
                <div>Total da compra</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {!isPaid && paymentMethod === 'PayPal' && (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                  }}
                >
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePaypalOrder}
                    onApprove={handleApprovePaypalOrder}
                  />
                </PayPalScriptProvider>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
