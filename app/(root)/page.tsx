import React from 'react';
import ProductList from '@/components/product/product-list';
import { getLatestProducts } from '@/lib/actions/product-actions';

export default async function Homepage() {
  const latestProducts = (await getLatestProducts()).map((product) => ({
    ...product,
    price: product.price.toString(),
    banner: product.images[0],
    rating: product.rating.toString(),
  }));

  return (
    <div className='text-xl'>
      <ProductList data={latestProducts} title='Produtos' limit={4} />
    </div>
  );
}
