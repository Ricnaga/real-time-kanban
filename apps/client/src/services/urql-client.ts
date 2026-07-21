import { Client, fetchExchange, subscriptionExchange } from '@urql/core';
import { createClient as createWSClient } from 'graphql-ws';
import type { SubscribePayload } from 'graphql-ws';
import { loadEnvironment } from '@/config';
import { graphCache } from './cache-exchange';

const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL } = loadEnvironment();

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

  return new Client({
    url: NEXT_PUBLIC_API_URL,
    exchanges: [graphCache, fetchExchange, ...subscription],
  });
}
