'use client';
import { formatCurrency } from '@/lib/utils';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function SalesChart({
  data: { salesData },
}: {
  data: {
    salesData: {
      month: string;
      totalSales: number;
    }[];
  };
}) {
  return (
    <ResponsiveContainer className='min-h-[200px] w-full'>
      <BarChart accessibilityLayer data={salesData}>
        <XAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toString()}
          dataKey='month'
        />

        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value.toString())}
        />
        <Bar
          dataKey='totalSales'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
