'use client';

import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';
import { createClient as createWSClient } from 'graphql-ws';
import type { SubscribePayload } from 'graphql-ws';

const wsClient =
  typeof window !== 'undefined'
    ? createWSClient({
        url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/graphql',
      })
    : null;

export const urqlClient = new Client({
  url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
  exchanges: [
    cacheExchange,
    fetchExchange,
    ...(wsClient
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
      : []),
  ],
});
