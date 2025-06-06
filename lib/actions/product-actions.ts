'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { Product, UpdateProduct } from '@/@types';
import {
  insertProductSchema,
  updateProductSchema,
} from '@/validation/validators';
import { Prisma } from '../generated/prisma';

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}

export async function getProductsBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: { slug },
  });
  return data;
}

export async function getProductsById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });
  return convertToPlainObject(data);
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page = 1,
  category,
  sort,
  price,
  rating,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  sort?: string;
  price?: string;
  rating?: string;
}) {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const categoryFilter = category && category !== 'all' ? { category } : {};

  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Produto deletado com sucesso',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function createProduct(data: Product) {
  try {
    const product = insertProductSchema.parse(data);

    if (!product.slug) {
      throw new Error('Slug is required');
    }

    await prisma.product.create({
      data: {
        ...product,
        slug: product.slug as string,
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Produto criado com sucesso',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateProduct(data: UpdateProduct) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: {
        ...product,
        slug: product.slug as string,
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Produto atualizado com sucesso',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return convertToPlainObject(data);
}

export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}