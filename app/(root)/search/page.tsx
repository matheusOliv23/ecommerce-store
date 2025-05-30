import ProductCard from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getAllCategories,
  getAllProducts,
} from '@/lib/actions/product-actions';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Search',
  description: 'Search',
};

const prices = [
  {
    name: 'Todos',
    value: 'all',
  },
  {
    name: 'R$0 - R$50',
    value: '1-50',
  },
  {
    name: 'R$51 - R$100',
    value: '51-100',
  },
  {
    name: 'R$101 - R$200',
    value: '101-200',
  },
  {
    name: 'R$201 - R$500',
    value: '201-500',
  },
  {
    name: 'R$501 - R$1000',
    value: '501-1000',
  },
];

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];
export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string;
    sort?: string;
    price?: string;
    rating?: string;
  }>;
}) {
  const {
    q = 'all',
    page = '1',
    category = 'all',
    sort = 'newest',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    page: parseInt(page, 10),
    category,
    sort,
    price,
    rating,
  });

  const categories = await getAllCategories();

  const ratings = [4, 3, 2, 1];

  const renderStars = (rating: number) => {
    const totalStars = 5;
    let stars = '';
    for (let i = 1; i <= totalStars; i++) {
      stars += i <= rating ? '★' : '☆';
    }
    return stars;
  };

  return (
    <section className='grid md:grid-cols-5 md:gap-5'>
      <Card className='filter-links min-w-[200px] p-4 '>
        {/* Categorias Section */}
        <div>
          <div className='text-lg font-semibold mb-3 '>Categorias</div>
          <ul className='space-y-2'>
            <li>
              <Link
                className={`block px-3 py-1 rounded hover:bg-gray-100 ${
                  category === 'all' || category === ''
                    ? 'font-bold  bg-blue-50'
                    : ''
                }`}
                href={getFilterUrl({ c: 'all' })}
              >
                Todos
              </Link>
            </li>
            {categories?.map((x) => (
              <li key={x.category}>
                <Link
                  className={`block px-3 py-1 rounded hover:bg-gray-100 ${
                    category === x.category ? 'font-bold  bg-blue-50' : ''
                  }`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <hr className='border-gray-200' />

        {/* Preço Section */}
        <div>
          <div className='text-lg font-semibold mb-3 '>Preço</div>
          <ul className='space-y-2'>
            {prices.map((x) => (
              <li key={x.value}>
                <Link
                  className={`block px-3 py-1 rounded hover:bg-gray-100 ${
                    price === x.value
                      ? 'font-bold  bg-blue-50'
                      : 'text-gray-600'
                  }`}
                  href={getFilterUrl({ p: x.value })}
                >
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <hr className='border-gray-200' />

        {/* Avaliação Section */}
        <div>
          <div className='text-lg font-semibold mb-3 '>Avaliação</div>
          <ul className='space-y-2'>
            <li>
              <Link
                className={`block px-3 py-1 rounded hover:bg-gray-100 ${
                  rating === 'all' || rating === ''
                    ? 'font-bold  bg-blue-50'
                    : 'text-gray-600'
                }`}
                href={getFilterUrl({ r: 'all' })}
              >
                Todos
              </Link>
            </li>
            {ratings?.map((r) => (
              <li key={r}>
                <Link
                  className={`flex items-center px-3 py-1 rounded hover:bg-gray-100 ${
                    rating === r.toString()
                      ? 'font-bold text-blue-600 bg-blue-50'
                      : 'text-gray-600'
                  }`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  <span className='text-yellow-500 mr-2'>{renderStars(r)}</span>
                  <span>&amp; Acima</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <section className='md:space-y-4 md:col-span-4'>
        {products.data.length === 0 && (
          <p className='text-xl mt-10 md:mt-0'>Nenhum produto encontrado</p>
        )}
        <div className='flex-between flex-col md:flex-row my-4'>
          <div className='flex items-center'>
            {q !== 'all' && q !== '' && 'Query: ' + q}
            {category !== 'all' && category !== '' && ' Categoria: ' + category}
            {price !== 'all' && price !== '' && ' Faixa de preço: ' + price}
            {rating !== 'all' && rating !== '' && ' Avaliação: ' + rating}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            (price !== 'all' && price !== '') ||
            (rating !== 'all' && rating !== '') ? (
              <Button variant={'link'} asChild>
                <Link href='/search'>Limpar filtro</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Filtrar por:{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 rounded hover:bg-gray-100 ${
                  sort === s ? 'font-bold  ' : ''
                }`}
                href={getFilterUrl({ s: s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {products?.data.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>
    </section>
  );
}
