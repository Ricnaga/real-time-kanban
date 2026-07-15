'use client';

import { Client, fetchExchange, subscriptionExchange } from '@urql/core';
import { createClient as createWSClient } from 'graphql-ws';
import type { SubscribePayload } from 'graphql-ws';
import { cacheExchange } from '@urql/exchange-graphcache';
import { loadEnvironment } from '@/config';

const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL } = loadEnvironment();

const wsClient =
  typeof window !== 'undefined'
    ? createWSClient({ url: NEXT_PUBLIC_WS_URL })
    : null;

const subscription = wsClient
  ? [
      subscriptionExchange({
        forwardSubscription: (request) => ({
          subscribe: (sink) => ({
            unsubscribe: wsClient.subscribe(request as SubscribePayload, sink),
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
});

export const urqlClient = new Client({
  url: NEXT_PUBLIC_API_URL,
  exchanges: [cache, fetchExchange, ...subscription],
});
