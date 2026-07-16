'use client';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

function BoardErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Erro ao carregar o board
        </h2>
        <p className="mt-2 text-sm text-zinc-500">{String(error)}</p>
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
        <p className="text-sm text-zinc-500">Algo deu errado.</p>
      </div>
    </ErrorBoundary>
  );
}
