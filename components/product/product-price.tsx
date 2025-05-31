import { cn } from '@/lib/utils';
import React from 'react';

export default function ProductPrice({
  value,
  className,
}: {
  value: string | number;
  className?: string;
}) {
  const stringValue = value.toString();

  const [intValue, floatValue] = stringValue.split('.');

  return (
    <p className={cn('text-2xl', className)}>
      {intValue}
      <span className='text-xs align-super'>.{floatValue}</span>
    </p>
  );
}
