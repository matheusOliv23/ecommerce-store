'use client';
import { UpdateUser } from '@/@types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUser } from '@/lib/actions/user-actions';
import { USER_ROLES } from '@/lib/constants';
import { updateUserSchema } from '@/validation/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import Error from 'next/error';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function UpdateUserForm({ user }: { user: UpdateUser }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: UpdateUser) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success('Usuário atualizado com sucesso');
      form.reset();
      router.push('/admin/users');
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao atualizar usuário');
    }
  };

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        action=''
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled {...field} placeholder='Digite seu email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Digite o nome do usuário' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full'>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Nível</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecione o nível do usuário' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex-between'>
          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? 'Atualizando...'
              : 'Atualizar Usuário'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
