'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';

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

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page = 1,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
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
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete product',
    };
  }
}