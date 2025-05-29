import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteUser, getAllUsers } from '@/lib/actions/user-actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Update Product',
  description: 'Update an existing product',
};

export default async function AdminUsersPage(props: {
  params: Promise<{
    page: string;
    query: string;
  }>;
}) {
  const { page = '1', query: searchText } = await props.params;
  const users = await getAllUsers({
    page: Number(page),
    query: searchText || '',
  });

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <h1 className='h2-bold'>Usuários</h1>
        {searchText && (
          <div>
            Filtrado por <i>&quot;{searchText}&quot;</i>
            <Link href={'/admin/users'} className='ml-2'>
              <Button variant={'outline'} size={'sm'}>
                Limpar filtro
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className='overflow-x-auto'>
        <Table className='mb-6'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>ID</TableHead>
              <TableHead className='text-left'>Nome</TableHead>
              <TableHead className='text-left'>Email</TableHead>
              <TableHead className='text-left'>Tipo da conta</TableHead>
              <TableHead className='text-left'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/order/${user.id}`}>{formatId(user.id)}</Link>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <Badge variant={'default'}>Admin</Badge>
                  ) : user.role === 'user' ? (
                    <Badge variant={'secondary'}>Usuário</Badge>
                  ) : (
                    'Usuário'
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant='outline' size={'sm'}>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className='text-blue-500'
                    >
                      Editar
                    </Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.totalPages > 1 && (
          <div className='flex justify-center mt-10 md:justify-end'>
            <Pagination
              totalPages={users?.totalPages as number}
              page={Number(page) || 1}
              urlParamName='page'
            />
          </div>
        )}
      </div>
    </div>
  );
}
