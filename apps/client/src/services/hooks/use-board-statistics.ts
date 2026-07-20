'use client';

import { useQuery } from 'urql';
import { GET_BOARD_STATISTICS } from '../graphql/queries';
import type { BoardStatisticsModel } from '@/schemas';

type StatisticsQueryResult = {
  boardStatistics: BoardStatisticsModel;
};

export function useBoardStatistics() {
  const [queryResult] = useQuery<StatisticsQueryResult>({
    query: GET_BOARD_STATISTICS,
  });

  return {
    statistics: queryResult.data?.boardStatistics ?? null,
    fetching: queryResult.fetching,
    error: queryResult.error,
  };
}
