import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '../ui/card';
import ProductPrice from './product-price';
import { Product } from '@/@types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='p-0 items-center'>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
            className='w-full'
          />
        </Link>
      </CardHeader>
      <CardContent className='p-4 grid gap-4'>
        <div className='text-xs'>{product?.brand}</div>
        <Link href={`/products/${product.slug}`}>
          <h2 className='text-sm font-medium'> {product.name}</h2>
        </Link>
        <div className='flex-between gap-4'>
          <p>{product?.rating} </p>
          {product.stock > 0 ? (
            <ProductPrice value={product?.price} />
          ) : (
            <p className='text-destructive'>Sem estoque</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
