'use client';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Heading } from '@/components/typography/heading/heading';
import { Text } from '@/components/typography/text/text';

function BoardErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <Heading as="h2">Erro ao carregar o board</Heading>
        <Text as="p" color="muted" className="mt-2">
          {String(error)}
        </Text>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      FallbackComponent={BoardErrorFallback}
      onReset={reset}
      resetKeys={[error.digest]}
    >
      <div className="flex flex-1 items-center justify-center">
        <Text as="p" size="2" color="muted">
          Algo deu errado.
        </Text>
      </div>
    </ErrorBoundary>
  );
}
