'use client';

import { forwardRef, type ComponentPropsWithRef } from 'react';
import { skeletonStyles } from './skeleton.tv';

type SkeletonProps = ComponentPropsWithRef<'div'>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={skeletonStyles({ className })} {...props} />
    );
  },
);

Skeleton.displayName = 'Skeleton';
