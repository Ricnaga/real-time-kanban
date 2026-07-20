'use client';

import { Text } from '@/components/typography/text/text';

export function BoardEmpty() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Text as="p" size="2" color="muted">
        Nenhuma action encontrada
      </Text>
    </div>
  );
}
