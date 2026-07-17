'use client';

import { useQuery } from 'urql';
import { GET_ACTIONS } from '../graphql/queries';
import type { ActionModel } from '@/schemas';

type ActionsQueryResult = {
  actions: ActionModel[];
};

type UseActionsOptions = {
  initialData?: ActionModel[];
};

export function useActions({ initialData = [] }: UseActionsOptions = {}) {
  const [queryResult] = useQuery<ActionsQueryResult>({ query: GET_ACTIONS });

  const actions = queryResult.data?.actions ?? initialData;

  return {
    actions,
    fetching: queryResult.fetching,
    error: queryResult.error,
  };
}
