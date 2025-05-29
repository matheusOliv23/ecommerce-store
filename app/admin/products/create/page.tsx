import ProductForm from '@/components/admin/product-form';
import React from 'react';

export const metadata = {
  title: 'Create Product',
  description: 'Create a new product',
};

export default function CreateProductPage() {
  return (
    <>
      <h2 className='h2-bold'>Criar Produto</h2>
      <div className='my-8'>
        <ProductForm type='create' />
      </div>
    </>
  );
}
