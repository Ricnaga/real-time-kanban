import { usePrometheus } from '@graphql-yoga/plugin-prometheus'
import type { Plugin } from 'graphql-yoga'

export const plugins: Plugin<{}>[] = [usePrometheus({ endpoint: '/metrics' })]
