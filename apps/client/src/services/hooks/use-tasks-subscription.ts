'use client';

import { useSubscription } from 'urql';
import {
  ON_TASK_CREATED,
  ON_TASK_UPDATED,
  ON_TASK_DELETED,
  ON_TASK_MOVED,
} from '../graphql/subscriptions';

export function useTasksSubscription() {
  const [taskCreated] = useSubscription({ query: ON_TASK_CREATED });
  const [taskUpdated] = useSubscription({ query: ON_TASK_UPDATED });
  const [taskDeleted] = useSubscription({ query: ON_TASK_DELETED });
  const [taskMoved] = useSubscription({ query: ON_TASK_MOVED });

  return {
    taskCreated: taskCreated.data?.taskCreated ?? null,
    taskUpdated: taskUpdated.data?.taskUpdated ?? null,
    taskDeleted: taskDeleted.data?.taskDeleted ?? null,
    taskMoved: taskMoved.data?.taskMoved ?? null,
  };
}
