import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrdersSummary } from '@/lib/actions/order-actions';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils';
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react';
import React from 'react';

import SalesChart from './sales-chart';

export const metadata = {
  title: 'Dashboard',
  description: 'Admin Dashboard',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized access');
  }

  const summary = await getOrdersSummary();

  if (!summary) {
    throw new Error('Failed to fetch orders summary');
  }

  return (
    <section className='space-y-2'>
      <h1 className='h2-bold'>Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Vendas Finalizadas
            </CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(
                summary.totalSales._sum.totalPrice?.toString() || '0'
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Vendas Pendentes
            </CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(
                summary.pendingSales._sum.totalPrice?.toString() || '0'
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>N° de Vendas</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Clientes</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Produtos</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-3 px-4'>
          <CardTitle>Visão geral</CardTitle>
          <CardContent>
            <SalesChart
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>
        <Card className='col-span-4 px-4'>
          <CardTitle>Visão geral</CardTitle>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.user.name ?? 'Usuário deletado'}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(order.totalPrice.toString())}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/order/${order.id}`}
                        className='text-blue-500 hover:underline'
                      >
                        Ver detalhes
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
