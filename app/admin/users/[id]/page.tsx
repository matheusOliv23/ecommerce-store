import { getUserById } from '@/lib/actions/user-actions';
import { notFound } from 'next/navigation';
import React from 'react';
import UpdateUserForm from './update-user-form';
import { UpdateProduct } from '@/@types';

export const metadata = {
  title: 'Atualizar Usuário',
  description: 'Atualizar Usuário',
};

export default async function AdminUserUpdate(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <div className='space-y-8 max-w-lg mx-auto'>
      <h1 className='h2-bold'>Editar usuário</h1>
      <UpdateUserForm user={user as any} />
    </div>
  );
}
