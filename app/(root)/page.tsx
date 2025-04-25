import React from 'react';
import sampleData from '@/db/sample-data';
import ProductList from '@/components/product/product-list';

export default function Homepage() {
  return (
    <div className='text-xl'>
      <ProductList data={sampleData?.products} title='Produtos' limit={4} />
    </div>
  );
}
