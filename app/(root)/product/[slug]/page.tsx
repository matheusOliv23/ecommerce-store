import React from 'react';
import { getProductsBySlug } from '@/lib/actions/product-actions';
import ProductPrice from '@/components/product/product-price';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductImages from '@/components/product/product-images';
import AddToCart from '@/components/product/add-to-cart';
import { getMyCart } from '@/lib/actions/cart-actions';

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductsBySlug(slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  const cart = await getMyCart();

  return (
    <div>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          <div className='col-span-2'>
            <ProductImages images={product.images} />
          </div>

          <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-6'>
              <p>
                {product.brand} {product.category}
              </p>
              <h1>{product.name}</h1>
              <p>
                {Number(product.rating)} of {product.numReviews} Reviews
              </p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                <ProductPrice
                  className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
                  value={Number(product.price)}
                />
              </div>
            </div>
            <div className='mt-10'>
              <div className='font-semibold'>Descrição</div>
              <p>{product.description}</p>
            </div>
          </div>

          <div>
            <Card className='h-fit py-0'>
              <CardContent className='p-4'>
                <div className='mb-2 flex justify-between'>
                  <div>Preço</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className='mb-2 flex justify-between'>
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant={'outline'}>Em estoque</Badge>
                  ) : (
                    <Badge variant={'destructive'}>Sem estoque</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className='flex-center mt-2'>
                    <AddToCart
                      cart={cart as any}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product?.price?.toString(),
                        quantity: 1,
                        image: product.images[0],
                      }}
                    />{' '}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
