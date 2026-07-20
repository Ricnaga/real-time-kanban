export type ColumnStatsModel = {
  id: string;
  title: string;
  step: string;
  taskCount: number;
};

export type BoardStatisticsModel = {
  columns: ColumnStatsModel[];
  totalTasks: number;
};
