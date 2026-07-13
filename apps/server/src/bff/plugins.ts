import { useHive } from '@graphql-hive/yoga';
import { usePrometheus } from '@graphql-yoga/plugin-prometheus';
import type { Plugin } from 'graphql-yoga';
import { loadEnvironment } from '@/config';

function createPlugins(): Plugin<{}>[] {
  const { HIVE_TOKEN, HIVE_TARGET } = loadEnvironment();

  return [
    usePrometheus({ endpoint: '/metrics' }),
    ...(HIVE_TOKEN?.startsWith('hvo1/') && HIVE_TARGET
      ? [
          useHive({
            enabled: true,
            token: HIVE_TOKEN,
            usage: { target: HIVE_TARGET },
          }),
        ]
      : []),
  ];
}

export const plugins = createPlugins();
