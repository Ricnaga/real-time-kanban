'use client';

import { useSubscription } from 'urql';
import { ON_ACTION_CREATED, ON_ACTION_MOVED } from '../graphql/subscriptions';

export function useActionsSubscription() {
  const [actionCreated] = useSubscription({ query: ON_ACTION_CREATED });
  const [actionMoved] = useSubscription({ query: ON_ACTION_MOVED });

  return {
    actionCreated: actionCreated.data?.actionCreated ?? null,
    actionMoved: actionMoved.data?.actionMoved ?? null,
  };
}
