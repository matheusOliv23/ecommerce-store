import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '../ui/card';
import ProductPrice from './product-price';
import { Product } from '@/@types';
import { Badge } from '../ui/badge';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className='w-full max-w-[250px] gap-0 p-0 rounded-xl'>
      <CardHeader className='p-0 items-center'>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={200}
            height={100}
            priority
            className='w-full h-[200px] rounded-t-xl'
          />
        </Link>
      </CardHeader>
      <CardContent className='p-4 grid'>
        <div className='flex gap-2 items-center'>
          <Badge>{product?.brand}</Badge>
          <Link href={`/products/${product.slug}`}>
            <h2 className='text-sm font-medium'> {product.name}</h2>
          </Link>
        </div>

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
