import { getClient } from '@/services/urql-rsc';
import { GET_ACTIONS } from '@/services/graphql/queries';
import { Board } from './_components/board';

export default async function BoardPage() {
  const client = getClient();
  const result = await client.query(GET_ACTIONS, {});

  if (result.error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-red-500">
          Erro ao carregar o board: {result.error.message}
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
      <Board initialActions={result.data?.actions ?? []} />
    </div>
  );
}
