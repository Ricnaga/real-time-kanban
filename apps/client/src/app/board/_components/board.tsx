'use client';

import { useActions } from '@/services/hooks/use-actions';
import { BoardColumn } from './board-column/board-column';
import type { ActionModel } from '@/schemas';

type Props = {
  initialActions: ActionModel[];
};

export function Board({ initialActions }: Props) {
  const { actions, fetching, error } = useActions({
    initialData: initialActions,
  });

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
    <main className="flex flex-1 gap-4 p-6 overflow-x-auto">
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
      {actions
        .sort((a, b) => a.position - b.position)
        .map((action) => (
          <BoardColumn key={action.id} action={action} />
        ))}
    </main>
  );
}
