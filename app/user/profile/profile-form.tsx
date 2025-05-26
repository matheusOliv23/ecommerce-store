'use client';
import { UpdateProfile } from '@/@types';
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
import { updateUserProfile } from '@/lib/actions/user-actions';
import { updateProfileSchema } from '@/validation/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ProfileForm() {
  const { data: session, update } = useSession();

  const form = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const onSubmit = async (values: UpdateProfile) => {
    const res = await updateUserProfile(values);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    await update(newSession);
    toast.success(res.message);
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-5'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder='Email'
                    className='input-field'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Digite seu nome'
                    className='input-field'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <Button
          disabled={form.formState.isSubmitting}
          type='submit'
          size={'lg'}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? (
            <span>Atualizando...</span>
          ) : (
            <span>Atualizar Perfil</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
