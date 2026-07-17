'use client';

import { useQuery } from 'urql';
import { GET_TASKS_BY_ACTION } from '../graphql/queries';
import type { TaskModel } from '@/schemas';

type TasksQueryResult = {
  tasksByAction: TaskModel[];
};

type UseTasksByActionOptions = {
  initialData?: TaskModel[];
};

export function useTasksByAction(
  actionId: string,
  { initialData = [] }: UseTasksByActionOptions = {},
) {
  const [queryResult] = useQuery<TasksQueryResult>({
    query: GET_TASKS_BY_ACTION,
    variables: { actionId },
  });

  const tasks = queryResult.data?.tasksByAction ?? initialData;

  return {
    tasks,
    fetching: queryResult.fetching,
    error: queryResult.error,
  };
}
