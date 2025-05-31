'use server';
import { Review } from '@/@types';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { insertReviewSchema } from '@/validation/validators';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

export async function createUpdateReview(data: Review) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error('Usuário não autenticado');

    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    const product = await prisma.product.findFirst({
      where: {
        id: review.productId,
      },
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const reviewExists = await prisma.review.findFirst({
      where: {
        userId: review.userId,
        productId: review.productId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        await tx.review.update({
          where: {
            id: reviewExists.id,
          },
          data: {
            rating: review.rating,
            description: review.description,
            title: review.title,
          },
        });
      } else {
        await tx.review.create({
          data: review,
        });
      }

      const averageRating = await prisma.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: review.productId,
        },
      });

      const numReviews = await prisma.review.count({
        where: {
          productId: review.productId,
        },
      });

      await tx.product.update({
        where: {
          id: review.productId,
        },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: 'Avaliação salva com sucesso',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getReviews({
  productId,
  page = 1,
  limit = 10,
}: {
  productId: string;
  page?: number;
  limit?: number;
}) {
  const data = await prisma.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const totalReviews = await prisma.review.count();

  return {
    data,
    totalPages: Math.ceil(totalReviews / limit),
  };
}

export async function getReviewByProductId(productId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Usuário não autenticado');

  return await prisma.review.findFirst({
    where: {
      userId: session.user.id,
      productId,
    },
  });
}
