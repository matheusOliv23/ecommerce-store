'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';

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