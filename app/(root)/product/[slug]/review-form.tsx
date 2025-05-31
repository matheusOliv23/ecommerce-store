'use client';
import { Review } from '@/@types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import {
  createUpdateReview,
  getReviewByProductId,
} from '@/lib/actions/review-actions';
import { insertReviewSchema } from '@/validation/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ReviewForm({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      userId,
      productId,
      rating: 1,
      title: '',
      description: '',
    },
  });

  const handleOpenForm = async () => {
    form.setValue('userId', userId);
    form.setValue('productId', productId);
    const review = await getReviewByProductId(productId);

    if (review) {
      form.setValue('title', review.title);
      form.setValue('description', review.description);
      form.setValue('rating', Number(review.rating));
    }
    setOpen(true);
  };

  const onSubmit = async (values: Review) => {
    const res = await createUpdateReview({
      ...values,
      productId,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    setOpen(false);
    onReviewSubmitted?.();

    toast.success('Avaliação enviada com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant={'default'}>
        Deixe sua Avaliação
      </Button>
      <DialogContent className='sm:max-w-[425px] '>
        <Form {...form}>
          <form
            action=''
            method='POST'
            onSubmit={form.handleSubmit(onSubmit as any)}
          >
            <DialogHeader>
              <DialogTitle>O que achou desse produto?</DialogTitle>
              <DialogDescription>
                Sua opinião é muito importante para nós e para outros clientes.
                Por favor, deixe uma avaliação sincera.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <Input
                      {...field}
                      type='text'
                      placeholder='Digite o título da sua avaliação'
                      className='input'
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <Textarea
                      {...field}
                      placeholder='Escreva sua avaliação aqui'
                      className='input'
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='rating'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avaliação</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione uma avaliação' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, index) => (
                          <SelectItem
                            key={index + 1}
                            value={(index + 1).toString()}
                          >
                            {index + 1}{' '}
                            {Array.from({ length: index + 1 }, (_, i) => (
                              <StarIcon
                                key={i}
                                className='inline h-4 w-4 text-yellow-500'
                              />
                            ))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type='submit'
                size={'lg'}
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Enviando...'
                  : 'Enviar Avaliação'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
