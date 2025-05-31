'use client';
import { Review } from '@/@types';
import Link from 'next/link';
import React, { useEffect } from 'react';
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Rating from '@/components/product/rating';

export default function ReviewList({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) {
  const [reviews, setReviews] = React.useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({
        productId,
      });
      setReviews(res.data as any);
    };

    loadReviews();
  }, [productId]);

  const reload = async () => {
    const res = await getReviews({
      productId,
    });
    setReviews([...res.data] as any);
  };

  return (
    <div className='space-y-4'>
      {reviews.length === 0 && <p className='mt-10'>Nenhuma avaliação ainda</p>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <p className=''>
          Por favor
          <Link
            className='text-blue-700 px-2 '
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            entre na sua conta
          </Link>
          para avaliar.
        </p>
      )}
      <div className='flex flex-col gap-3'>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className='flex-between'>
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
              <CardContent className='p-0'>
                <div className='flex flex-col space-y-2 space-x-4 text-sm text-muted-foreground'>
                  <Rating value={review.rating} />
                  <div className='flex items-center'>
                    <User className='w-3 h-3 mr-1' />
                    {review.user?.name || 'Usuário'}
                  </div>

                  <div className='flex items-center'>
                    <Calendar className='w-3 h-3 mr-1' />
                    {formatDateTime(review.createdAt).dateTime}
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
