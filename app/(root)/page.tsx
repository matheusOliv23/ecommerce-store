import React from 'react';
import ProductList from '@/components/product/product-list';
import { getLatestProducts } from '@/lib/actions/product-actions';

export default async function Homepage() {
  const latestProducts = await getLatestProducts();

  return (
    <div className='text-xl'>
      <ProductList data={latestProducts} title='Produtos' limit={4} />
    </div>
  );
}
