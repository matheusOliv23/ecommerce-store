'use client';
import { Product } from '@/@types';
import {
  insertProductSchema,
  updateProductSchema,
} from '@/validation/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import slugify from 'slugify';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createProduct, updateProduct } from '@/lib/actions/product-actions';
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { Checkbox } from '../ui/checkbox';

export default function ProductForm({
  type,
  product,
  productId,
}: {
  type: 'create' | 'edit';
  product?: Product;
  productId?: string;
}) {
  const router = useRouter();

  const form = useForm<any>({
    resolver:
      type === 'create'
        ? zodResolver(insertProductSchema)
        : zodResolver(updateProductSchema),
    defaultValues:
      product && type === 'edit'
        ? product
        : {
            name: '',
            slug: '',
            category: '',
            brand: '',
            price: 0,
            stock: 0,
            description: '',
            isFeatured: false,
            images: [],
          },
  });

  const onSubmit = async (values: Product) => {
    if (type === 'create') {
      const res = await createProduct(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push(`/admin/products`);
    }

    if (type === 'edit') {
      if (!productId) {
        router.push('/admin/products');
      }
      const res = await updateProduct({ ...values, id: productId as string });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push(`/admin/products/${productId}`);
    }
  };

  const images = form.watch('images');

  const isFeatured = form.watch('isFeatured');

  const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        action=''
        className='space-y-8'
      >
        <div className='flex flex-col md:flex-row gap-5'>
          <div className='flex-1'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Nome do produto' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex-1'>
            {' '}
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input {...field} placeholder='Slug do produto' />
                      <Button
                        type='button'
                        className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
                        onClick={() => {
                          form.setValue(
                            'slug',
                            slugify(form.getValues('name'), {
                              lower: true,
                            })
                          );
                        }}
                      >
                        Gerar Slug
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-5'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Categoria' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Marca' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col md:flex-row gap-5'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    placeholder='Digite o preço'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='stock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    placeholder='Digite o estoque'
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='upload-field'>
          Destacar Produto
          <Card>
            <CardContent className='space-t-2 mt-2'>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-2'>
                    <FormControl>
                      <Checkbox
                        onCheckedChange={field.onChange}
                        checked={field.value}
                      />
                    </FormControl>
                    <FormLabel>Destacar Produto</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt='Featured Product Banner'
                  className='w-full object-cover rounded-md'
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint={'imageUploader'}
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(
                      error.message || 'Erro ao fazer upload da imagem'
                    );
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    className='resize-none'
                    {...field}
                    placeholder='Descreva seu produto...'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {images.map((image: string, index: number) => (
                        <Image
                          key={image}
                          src={image}
                          alt={`Product Image`}
                          width={100}
                          height={100}
                          className='w-20 h-20 object-cover object-center rounded-sm'
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint={'imageUploader'}
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(
                              error.message || 'Erro ao fazer upload da imagem'
                            );
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          size={'lg'}
          className='w-full button col-span-2'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? 'Enviando'
            : `${type === 'create' ? 'Criar' : 'Editar'} Produto`}
        </Button>
      </form>
    </Form>
  );
}
