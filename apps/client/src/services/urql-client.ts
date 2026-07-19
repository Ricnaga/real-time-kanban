import { Client, fetchExchange, subscriptionExchange } from '@urql/core';
import { createClient as createWSClient } from 'graphql-ws';
import type { SubscribePayload } from 'graphql-ws';
import { cacheExchange } from '@urql/exchange-graphcache';
import { loadEnvironment } from '@/config';
import { GET_ACTIONS, GET_TASKS_BY_ACTION } from './graphql/queries';

const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL } = loadEnvironment();

type TasksByActionData = {
  tasksByAction: Array<{
    id: string;
    title: string;
    description: string | null;
    position: number;
    actionId: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

type ActionsData = {
  actions: Array<{
    id: string;
    title: string;
    step: string;
    position: number;
  }>;
};

export function makeClient() {
  const wsClient =
    typeof window !== 'undefined'
      ? createWSClient({ url: NEXT_PUBLIC_WS_URL })
      : null;

  const subscription = wsClient
    ? [
        subscriptionExchange({
          forwardSubscription: (request) => ({
            subscribe: (sink) => ({
              unsubscribe: wsClient.subscribe(
                request as SubscribePayload,
                sink,
              ),
            }),
          }),
        }),
      ]
    : [];

  const cache = cacheExchange({
    keys: {
      Action: (data) => data.id as string,
      Task: (data) => data.id as string,
    },
    updates: {
      Subscription: {
        taskCreated: (result, _args, cache) => {
          const task = result.taskCreated as
            TasksByActionData['tasksByAction'][number] | null;
          if (!task) return;
          cache.updateQuery<TasksByActionData>(
            {
              query: GET_TASKS_BY_ACTION,
              variables: { actionId: task.actionId },
            },
            (data) => {
              if (!data) return data;
              if (data.tasksByAction.some((t) => t.id === task.id)) return data;
              return {
                tasksByAction: [...data.tasksByAction, task].sort(
                  (a, b) => a.position - b.position,
                ),
              };
            },
          );
        },
        taskUpdated: (result, _args, cache) => {
          const task = result.taskUpdated as
            TasksByActionData['tasksByAction'][number] | null;
          if (!task) return;
          cache.updateQuery<TasksByActionData>(
            {
              query: GET_TASKS_BY_ACTION,
              variables: { actionId: task.actionId },
            },
            (data) => {
              if (!data) return data;
              return {
                tasksByAction: data.tasksByAction.map((t) =>
                  t.id === task.id ? task : t,
                ),
              };
            },
          );
        },
        taskDeleted: (result, _args, cache) => {
          const taskId = result.taskDeleted as string | null;
          if (!taskId) return;
          const actionsData = cache.readQuery<ActionsData>({
            query: GET_ACTIONS,
          });
          if (!actionsData?.actions) return;
          for (const action of actionsData.actions) {
            cache.updateQuery<TasksByActionData>(
              {
                query: GET_TASKS_BY_ACTION,
                variables: { actionId: action.id },
              },
              (data) => {
                if (!data) return data;
                return {
                  tasksByAction: data.tasksByAction.filter(
                    (t) => t.id !== taskId,
                  ),
                };
              },
            );
          }
        },
        taskMoved: (result, _args, cache) => {
          const tasks = result.taskMoved as
            TasksByActionData['tasksByAction'] | null;
          if (!tasks || tasks.length === 0) return;

          const actionsData = cache.readQuery<ActionsData>({
            query: GET_ACTIONS,
          });
          if (!actionsData?.actions) return;

          const destActionId = tasks[0].actionId;

          for (const action of actionsData.actions) {
            if (action.id === destActionId) {
              cache.updateQuery<TasksByActionData>(
                {
                  query: GET_TASKS_BY_ACTION,
                  variables: { actionId: action.id },
                },
                (data) => {
                  if (!data) return data;
                  return { tasksByAction: tasks };
                },
              );
            } else {
              cache.updateQuery<TasksByActionData>(
                {
                  query: GET_TASKS_BY_ACTION,
                  variables: { actionId: action.id },
                },
                (data) => {
                  if (!data) return data;
                  return {
                    tasksByAction: data.tasksByAction.filter(
                      (t) => !tasks.some((m) => m.id === t.id),
                    ),
                  };
                },
              );
            }
          }
        },
        actionCreated: (result, _args, cache) => {
          const action = result.actionCreated as
            ActionsData['actions'][number] | null;
          if (!action) return;
          cache.updateQuery<ActionsData>({ query: GET_ACTIONS }, (data) => {
            if (!data) return data;
            if (data.actions.some((a) => a.id === action.id)) return data;
            return {
              actions: [...data.actions, action].sort(
                (a, b) => a.position - b.position,
              ),
            };
          });
        },
        actionMoved: (result, _args, cache) => {
          const actions = result.actionMoved as ActionsData['actions'] | null;
          if (!actions) return;
          cache.updateQuery<ActionsData>({ query: GET_ACTIONS }, () => ({
            actions,
          }));
        },
      },
    },
  });

  return new Client({
    url: NEXT_PUBLIC_API_URL,
    exchanges: [cache, fetchExchange, ...subscription],
  });
}
