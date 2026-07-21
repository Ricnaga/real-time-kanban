'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Legend,
} from 'recharts';
import type { PieSectorShapeProps } from 'recharts';
import { useBoardStatistics } from '@/services/hooks/use-board-statistics';
import { Heading } from '@/components/typography/heading/heading';
import { Text } from '@/components/typography/text/text';
import type { BoardStatisticsModel } from '@/schemas';
import { statisticsDashboardStyles } from './statistics-dashboard.tv';
import { StatisticsLoading } from './statistics-loading';
import { StatisticsEmpty } from './statistics-empty';
import { StatisticsError } from './statistics-error';
import { StatisticsMetricCard } from './statistics-metric-card/statistics-metric-card';
import { StatisticsChartCard } from './statistics-chart-card/statistics-chart-card';

const PIE_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
];

type StatisticsDashboardProps = {
  initialData?: BoardStatisticsModel;
};

function renderPieShape(props: PieSectorShapeProps) {
  const fill = PIE_COLORS[(props.index ?? 0) % PIE_COLORS.length];
  return <Sector {...props} fill={fill} />;
}

export function StatisticsDashboard({ initialData }: StatisticsDashboardProps) {
  const { statistics, fetching, error } = useBoardStatistics();
  const styles = statisticsDashboardStyles();

  if (fetching && !initialData) return <StatisticsLoading />;

  if (error) return <StatisticsError message={error.message} />;

  const data = statistics ?? initialData;

  if (!data) return <StatisticsEmpty />;

  const barData = data.columns.map((col) => ({
    name: col.title,
    tasks: col.taskCount,
    step: col.step,
  }));

  const pieData = data.columns.map((col) => ({
    name: col.title,
    value: col.taskCount,
  }));

  const maxColumn = data.columns.reduce(
    (max, col) => (col.taskCount > max.taskCount ? col : max),
    data.columns[0],
  );

  const average =
    data.columns.length > 0
      ? Math.round(data.totalTasks / data.columns.length)
      : 0;

  return (
    <div className={styles.container()}>
      <div className={styles.header()}>
        <Heading as="h1" size="3">
          Estatisticas do Board
        </Heading>
        <Text as="p" size="2" className={styles.subtitle()}>
          Visao geral das colunas e cards
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticsMetricCard label="Total de Cards" value={data.totalTasks} />
        <StatisticsMetricCard
          label="Total de Colunas"
          value={data.columns.length}
        />
        <StatisticsMetricCard
          label="Coluna com Mais Cards"
          value={maxColumn?.title ?? '-'}
        />
        <StatisticsMetricCard label="Media por Coluna" value={average} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatisticsChartCard title="Cards por Coluna">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </StatisticsChartCard>

        <StatisticsChartCard title="Distribuicao por Coluna">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                shape={renderPieShape}
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </StatisticsChartCard>
      </div>
    </div>
  );
}
