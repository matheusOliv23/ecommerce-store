'use client';
import { PaymentMethod } from '@/@types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user-actions';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { paymentMethodSchema } from '@/validation/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function PaymentMethodForm({
  defaultPaymentMethod,
}: {
  defaultPaymentMethod: string;
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: defaultPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit = (values: PaymentMethod) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/place-order');
    });
  };

  return (
    <div>
      <div className='max-w-md mx-auto space-y-4'>
        <h1 className='h2-bold mt-4'>Método de pagamento</h1>
        <p className='text-sm text-muted-foreground'>
          Escolha o método de pagamento que deseja usar para concluir sua
          compra.
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
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className='flex flex-col gap-2'
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <FormItem
                            key={method}
                            className='flex items-center space-x-3'
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={method}
                                checked={field.value === method}
                              />
                            </FormControl>
                            <FormLabel className='text-sm font-medium'>
                              {method}{' '}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-between gap-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => router.push('/shipping-address')}
                disabled={isPending}
              >
                Voltar
              </Button>
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
