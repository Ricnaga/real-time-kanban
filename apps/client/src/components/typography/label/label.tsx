'use client';

import { forwardRef, type ComponentPropsWithRef } from 'react';
import { Label as RadixLabel } from 'radix-ui';
import { labelStyles } from './label.tv';

type LabelProps = ComponentPropsWithRef<typeof RadixLabel.Root> & {
  size?: '1' | '2';
  weight?: 'medium' | 'semibold';
  color?: 'default' | 'muted';
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size, weight, color, className, ...props }, ref) => {
    return (
      <RadixLabel.Root
        ref={ref}
        className={labelStyles({ size, weight, color, className })}
        {...props}
      />
    );
  },
);

Label.displayName = 'Label';
