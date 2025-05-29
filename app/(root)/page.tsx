import React from 'react';
import ProductList from '@/components/product/product-list';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product-actions';
import { Product } from '@/@types';
import ProductCarousel from '@/components/product/product-carousel';

export default async function Homepage() {
  const latestProducts = (await getLatestProducts()).map((product: any) => ({
    ...product,
    price: product.price.toString(),
    banner: product.images[0],
    rating: product.rating.toString(),
  }));

  const featureProductsRaw = await getFeaturedProducts();
  const featureProducts = featureProductsRaw.map((product: any) => ({
    ...product,
    banner: product.banner === null ? undefined : product.banner,
  }));

  return (
    <div className='text-xl'>
      {featureProducts.length > 0 && <ProductCarousel data={featureProducts} />}
      <ProductList data={latestProducts} title='Produtos' limit={4} />
    </div>
  );
}
