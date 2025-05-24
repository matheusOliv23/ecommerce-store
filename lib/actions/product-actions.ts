'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';
import { PrismaClient } from '@prisma/client';

export async function getLatestProducts() {
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