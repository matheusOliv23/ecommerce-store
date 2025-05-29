import ProductForm from '@/components/admin/product-form';
import { getProductsById } from '@/lib/actions/product-actions';
import { notFound } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Update Product',
  description: 'Update an existing product',
};

export default async function AdminProductUpdate(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  const product = await getProductsById(id);

  if (!product) return notFound();

  return (
    <section className='space-y-8 max-w-5xl mx-auto'>
      <h1 className='h2-bold'>Editar produto</h1>
      <ProductForm
        type='edit'
        product={product as any}
        productId={product.id}
      />
    </section>
  );
}
