'use client';

import { Text } from '@/components/typography/text/text';

type BoardErrorProps = {
  message: string;
};

export function BoardError({ message }: BoardErrorProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Text as="p" size="2" className="text-red-500">
        Erro ao carregar o board: {message}
      </Text>
    </div>
  );
}
