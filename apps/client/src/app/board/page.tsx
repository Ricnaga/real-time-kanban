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
      <Board initialActions={result.data?.actions ?? []} />
    </div>
  );
}
