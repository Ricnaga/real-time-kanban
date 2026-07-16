'use client';

import { useQuery, useSubscription } from 'urql';
import { GET_ACTIONS } from '../graphql/queries';
import { ON_ACTION_CREATED, ON_ACTION_MOVED } from '../graphql/subscriptions';
import type { ActionModel } from '@/schemas';

type ActionsQueryResult = {
  actions: ActionModel[];
};

type UseActionsOptions = {
  initialData?: ActionModel[];
};

export function useActions({ initialData = [] }: UseActionsOptions = {}) {
  const [queryResult] = useQuery<ActionsQueryResult>({ query: GET_ACTIONS });

  const base = queryResult.data?.actions ?? initialData;

  useSubscription<{ actionCreated: ActionModel }, ActionsQueryResult>(
    { query: ON_ACTION_CREATED },
    (prev, data) => ({
      actions: [...(prev?.actions ?? []), data.actionCreated],
    }),
  );

  useSubscription<{ actionMoved: ActionModel[] }, ActionsQueryResult>(
    { query: ON_ACTION_MOVED },
    (_prev, data) => ({
      actions: data.actionMoved,
    }),
  );

  return {
    actions: base,
    fetching: queryResult.fetching,
    error: queryResult.error,
  };
}
