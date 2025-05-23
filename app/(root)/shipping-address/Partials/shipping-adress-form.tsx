'use client';
import { ShippingAddress } from '@/@types';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { shippingAddressSchema } from '@/validation/cart-schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader } from 'lucide-react';
import { updateUserAddress } from '@/lib/actions/user-actions';
import { toast } from 'sonner';

export default function ShippingAdressForm({
  address,
}: {
  address: ShippingAddress;
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: address?.fullName || '',
      city: address?.city || '',
      streetAddress: address?.streetAddress || '',
      postalCode: address?.postalCode || '',
      lat: address?.lat || 0,
      lng: address?.lng || 0,
      phoneNumber: address?.phoneNumber || '',
      country: address?.country || '',
    },
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit = (values: ShippingAddress) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/payment-method');
    });
  };

  return (
    <div>
      <div className='max-w-md mx-auto space-y-4'>
        <h1 className='h2-bold mt-4'>Endereço de entrega</h1>
        <p className='text-sm text-muted-foreground'>
          Preencha os dados abaixo para continuar com a compra.
        </p>
        <Form {...form}>
          <form
            method='post'
            className='space-y-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='flex flex-col gap-5'>
              <FormField
                control={form.control}
                name='postalCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder='CEP' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder='Nome completo' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='streetAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder='Endereço' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder='Cidade' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder='País' {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}{' '}
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
