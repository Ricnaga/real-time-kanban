'use client';

import { forwardRef, type ComponentPropsWithRef } from 'react';
import { textStyles } from './text.tv';

type TextTag = 'p' | 'span';

type TextOwnProps = {
  as?: TextTag;
  size?: '1' | '2' | '3';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted';
};

type TextProps<T extends TextTag = 'p'> = TextOwnProps &
  Omit<ComponentPropsWithRef<T>, keyof TextOwnProps>;

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    { as: Tag = 'p', size, weight, color, className, children, ...props },
    ref,
  ) => {
    return (
      <Tag
        ref={ref}
        className={textStyles({ size, weight, color, className })}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Text.displayName = 'Text';
