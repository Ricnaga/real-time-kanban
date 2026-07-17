'use client';

import { useState } from 'react';
import { useActions } from '@/services/hooks/use-actions';
import { BoardColumn } from './board-column/board-column';
import { FabCreateTask } from './fab-create-task/fab-create-task';
import { DialogCreateTask } from './dialog-create-task/dialog-create-task';
import type { ActionModel } from '@/schemas';

type Props = {
  initialActions: ActionModel[];
};

export function Board({ initialActions }: Props) {
  const { actions, fetching, error } = useActions({
    initialData: initialActions,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedActions = actions.sort((a, b) => a.position - b.position);
  const firstActionId = sortedActions[0]?.id;

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-red-500">
          Erro ao carregar o board: {error.message}
        </p>
      </div>
    );
  }

  return (
    <main className="relative flex flex-1 gap-4 p-6 overflow-x-auto">
      {fetching && actions.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-zinc-500">Carregando board...</p>
        </div>
      )}
      {!fetching && actions.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-zinc-500">Nenhuma action encontrada</p>
        </div>
      )}
      {sortedActions.map((action) => (
        <BoardColumn key={action.id} action={action} />
      ))}

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
  );
}
