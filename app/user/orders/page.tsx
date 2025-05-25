import React from 'react';
import Link from 'next/link';
import { getMyOrders } from '@/lib/actions/order-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Pagination from '@/components/shared/pagination';

export const metadata = {
  title: 'Meus Pedidos',
  description: 'Meus Pedidos',
};

export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await props.searchParams;

  const orders = await getMyOrders({
    page: Number(page) || 1,
    limit: 1,
  });

  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Meus pedidos</h2>
      <div className='overflow-x-auto'>
        <Table className='mb-6'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>ID</TableHead>
              <TableHead className='text-left'>Data</TableHead>
              <TableHead className='text-left'>Total</TableHead>
              <TableHead className='text-left'>Status do pagamento</TableHead>
              <TableHead className='text-left'>Status da entrega</TableHead>
              <TableHead className='text-left'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/order/${order.id}`}>{formatId(order.id)}</Link>
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Pendente'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Pendente'}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`} className='text-blue-500'>
                    Ver detalhes
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders?.totalPages! >= 1 && (
          <div className='flex justify-center mt-10 md:justify-end'>
            <Pagination
              totalPages={orders?.totalPages as number}
              page={Number(page) || 1}
              urlParamName='page'
            />
          </div>
        )}
      </div>
    </div>
  );
}
