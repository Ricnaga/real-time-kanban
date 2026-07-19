'use client';

import { forwardRef, type ComponentPropsWithRef } from 'react';
import { headingStyles } from './heading.tv';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeadingOwnProps = {
  as?: HeadingTag;
  size?: '1' | '2' | '3' | '4' | '5' | '6';
  color?: 'default' | 'muted';
};

type HeadingProps<T extends HeadingTag = 'h2'> = HeadingOwnProps &
  Omit<ComponentPropsWithRef<T>, keyof HeadingOwnProps>;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', size, color, className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={headingStyles({ size, color, className })}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Heading.displayName = 'Heading';
