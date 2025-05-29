import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteProduct, getAllProducts } from '@/lib/actions/product-actions';
import { formatCurrency, formatId } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default async function AdminProductsPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({
    page,
    query: searchText,
    category,
  });

  return (
    <section className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <h1 className='h2-bold'>Produtos</h1>
          {searchText && (
            <div>
              Filtrado por <i>&quot;{searchText}&quot;</i>
              <Link href={'/admin/products'} className='ml-2'>
                <Button variant={'outline'} size={'sm'}>
                  Limpar filtro
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant={'default'}>
          <Link href={'/admin/products/create'}>Adicionar Produto</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-left'>ID</TableHead>
            <TableHead className='text-left'>Nome</TableHead>
            <TableHead className='text-left'>Preço</TableHead>
            <TableHead className='text-left'>Categoria</TableHead>
            <TableHead className='text-left'>Estoque</TableHead>
            <TableHead className='text-left'>Nota</TableHead>
            <TableHead className='text-left'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.data?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell>
                <Button asChild variant={'outline'} size={'sm'}>
                  <Link href={`/admin/products/${product.id}`}>Editar</Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages > 1 && (
        <div className='flex justify-center mt-10 md:justify-end'>
          <Pagination
            page={page}
            totalPages={products.totalPages}
            urlParamName='page'
          />
        </div>
      )}
    </section>
  );
}
