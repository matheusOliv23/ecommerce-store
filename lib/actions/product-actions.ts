'use server';

import { PrismaClient } from '../generated/prisma/default';
import { convertToPlainObject } from '../utils';

export async function getLatestProducts() {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}


export async function getProductsBySlug(slug: string) {
  const prisma = new PrismaClient();

  const data = await prisma.product.findFirst({
    where: { slug },
  });
  return data;
}