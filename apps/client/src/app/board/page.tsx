import { getClient } from '@/services/urql-rsc';
import { GET_ACTIONS } from '@/services/graphql/queries';
import { Board } from './_components/board';
import { Text } from '@/components/typography/text/text';

export default async function BoardPage() {
  const client = getClient();
  const result = await client.query(GET_ACTIONS, {});

  if (result.error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Text as="p" size="2" className="text-red-500">
          Erro ao carregar o board: {result.error.message}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Board initialActions={result.data?.actions ?? []} />
    </div>
  );
}
