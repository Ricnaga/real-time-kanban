'use client';

import { useActions } from '@/services/hooks/use-actions';
import { Column } from './_components/column/column';

export default function Board() {
  const { actions, fetching, error } = useActions();

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
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Kanban Board
        </h1>
      </header>
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
            <Column key={action.id} action={action} />
          ))}
      </main>
    </div>
  );
}
