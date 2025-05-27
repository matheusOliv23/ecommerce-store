import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllOrders } from '@/lib/actions/order-actions';
import { requireAdmin } from '@/lib/auth-guard';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Admin Orders',
  description: 'Admin Orders Page',
};

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{
    page: string;
  }>;
}) {
  await requireAdmin();

  const { page } = await props.searchParams;

  const orders = await getAllOrders({
    page: Number(page) || 1,
  });

  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Pedidos</h2>
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
                  <Button asChild variant='outline' size={'sm'}>
                    <Link href={`/order/${order.id}`} className='text-blue-500'>
                      Ver detalhes
                    </Link>
                  </Button>
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
