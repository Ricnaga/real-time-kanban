'use client';

import { useQuery, useSubscription } from 'urql';
import { GET_TASKS_BY_ACTION } from '../graphql/queries';
import {
  ON_TASK_CREATED,
  ON_TASK_UPDATED,
  ON_TASK_DELETED,
  ON_TASK_MOVED,
} from '../graphql/subscriptions';
import type { TaskModel } from '@/schemas';

type TasksQueryResult = {
  tasksByAction: TaskModel[];
};

export function useTasksByAction(actionId: string) {
  const [queryResult] = useQuery<TasksQueryResult>({
    query: GET_TASKS_BY_ACTION,
    variables: { actionId },
  });

  const base = queryResult.data?.tasksByAction ?? [];

  useSubscription<{ taskCreated: TaskModel }, TasksQueryResult>(
    { query: ON_TASK_CREATED, pause: !actionId },
    (prev, data) => ({
      tasksByAction: [...(prev?.tasksByAction ?? []), data.taskCreated],
    }),
  );

  useSubscription<{ taskUpdated: TaskModel }, TasksQueryResult>(
    { query: ON_TASK_UPDATED, pause: !actionId },
    (prev, data) => ({
      tasksByAction: (prev?.tasksByAction ?? []).map((task) =>
        task.id === data.taskUpdated.id ? data.taskUpdated : task,
      ),
    }),
  );

  useSubscription<{ taskDeleted: string }, TasksQueryResult>(
    { query: ON_TASK_DELETED, pause: !actionId },
    (prev, data) => ({
      tasksByAction: (prev?.tasksByAction ?? []).filter(
        (task) => task.id !== data.taskDeleted,
      ),
    }),
  );

  useSubscription<{ taskMoved: TaskModel[] }, TasksQueryResult>(
    { query: ON_TASK_MOVED, pause: !actionId },
    (_prev, data) => ({
      tasksByAction: data.taskMoved,
    }),
  );

  return {
    tasks: base,
    fetching: queryResult.fetching,
    error: queryResult.error,
  };
}
