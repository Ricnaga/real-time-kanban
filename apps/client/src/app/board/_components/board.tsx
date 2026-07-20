'use client';

import { useMemo, useState } from 'react';
import { useActions } from '@/services/hooks/use-actions';
import { BoardDndProvider } from '../_providers/board-dnd-context';
import { FabCreateTask } from './fab-create-task/fab-create-task';
import { DialogCreateTask } from './dialog-create-task/dialog-create-task';
import { BoardDndLayer } from './board-dnd-layer/board-dnd-layer';
import { Text } from '@/components/typography/text/text';
import type { ActionModel } from '@/schemas';

type Props = {
  initialActions: ActionModel[];
};

export function Board({ initialActions }: Props) {
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
    return (
      <div className="flex flex-1 items-center justify-center">
        <Text as="p" size="2" className="text-red-500">
          Erro ao carregar o board: {error.message}
        </Text>
      </div>
    );
  }

  return (
    <BoardDndProvider columnIds={columnIds}>
      <main className="relative flex flex-1 gap-4 p-6 overflow-x-auto">
        {fetching && actions.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <Text as="p" size="2" color="muted">
              Carregando board...
            </Text>
          </div>
        )}
        {!fetching && actions.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <Text as="p" size="2" color="muted">
              Nenhuma action encontrada
            </Text>
          </div>
        )}

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
