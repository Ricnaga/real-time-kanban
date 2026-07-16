'use client';

import { useMemo } from 'react';
import { UrqlProvider, ssrExchange } from '@urql/next';
import { makeClient } from './urql-client';

export function UrqlClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined',
    });
    const client = makeClient();

    return [client, ssr];
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}
