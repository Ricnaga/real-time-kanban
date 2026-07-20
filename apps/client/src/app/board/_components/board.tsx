'use client';

import { useMemo, useState } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { useActions } from '@/services/hooks/use-actions';
import { BoardDndProvider } from '../_providers/board-dnd-context';
import { FabCreateTask } from './fab-create-task/fab-create-task';
import { DialogCreateTask } from './dialog-create-task/dialog-create-task';
import { BoardDndLayer } from './board-dnd-layer/board-dnd-layer';
import { BoardLoading } from './board-loading';
import { BoardEmpty } from './board-empty';
import { BoardError } from './board-error';
import { Heading } from '@/components/typography/heading/heading';
import { Text } from '@/components/typography/text/text';
import type { ActionModel } from '@/schemas';

type Props = {
  initialActions: ActionModel[];
};

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

export function Board({ initialActions }: Props) {
  return (
    <ErrorBoundary FallbackComponent={BoardErrorFallback}>
      <BoardContent initialActions={initialActions} />
    </ErrorBoundary>
  );
}

function BoardContent({ initialActions }: Props) {
  const { actions, fetching, error } = useActions({
    initialData: initialActions,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedActions = [...actions].sort((a, b) => a.position - b.position);
  const firstActionId = sortedActions[0]?.id;
  const columnIds = useMemo(
    () => sortedActions.map((a) => a.id),
    [sortedActions],
  );

  if (error) {
    return <BoardError message={error.message} />;
  }

  return (
    <BoardDndProvider columnIds={columnIds}>
      <main className="relative flex flex-1 gap-4 p-6 overflow-x-auto">
        {fetching && actions.length === 0 && <BoardLoading />}

        {!fetching && actions.length === 0 && <BoardEmpty />}

        <BoardDndLayer sortedActions={sortedActions} />

        {firstActionId && (
          <>
            <FabCreateTask onClick={() => setDialogOpen(true)} />
            <DialogCreateTask
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              firstActionId={firstActionId}
            />
          </>
        )}
      </main>
    </BoardDndProvider>
  );
}
