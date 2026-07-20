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
  Cell,
  Legend,
} from 'recharts';
import { useBoardStatistics } from '@/services/hooks/use-board-statistics';
import { Text } from '@/components/typography/text/text';
import { Heading } from '@/components/typography/heading/heading';
import { statisticsDashboardStyles } from './statistics-dashboard.tv';

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
  initialData?: {
    columns: { id: string; title: string; step: string; taskCount: number }[];
    totalTasks: number;
  };
};

export function StatisticsDashboard({ initialData }: StatisticsDashboardProps) {
  const { statistics, fetching, error } = useBoardStatistics();
  const styles = statisticsDashboardStyles();

  if (fetching && !initialData) {
    return (
      <div className={styles.container()}>
        <div className="flex flex-1 items-center justify-center">
          <Text as="p" size="2" className="text-zinc-500">
            Carregando estatisticas...
          </Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container()}>
        <div className="flex flex-1 items-center justify-center">
          <Text as="p" size="2" className="text-red-500">
            Erro ao carregar estatisticas: {error.message}
          </Text>
        </div>
      </div>
    );
  }

  const data = statistics ?? initialData;

  if (!data) {
    return (
      <div className={styles.container()}>
        <div className="flex flex-1 items-center justify-center">
          <Text as="p" size="2" className="text-zinc-500">
            Nenhum dado disponivel
          </Text>
        </div>
      </div>
    );
  }

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

      <div className={styles.metricsGrid()}>
        <div className={styles.metricCard()}>
          <Text as="span" className={styles.metricLabel()}>
            Total de Cards
          </Text>
          <Text as="span" className={styles.metricValue()}>
            {data.totalTasks}
          </Text>
        </div>
        <div className={styles.metricCard()}>
          <Text as="span" className={styles.metricLabel()}>
            Total de Colunas
          </Text>
          <Text as="span" className={styles.metricValue()}>
            {data.columns.length}
          </Text>
        </div>
        <div className={styles.metricCard()}>
          <Text as="span" className={styles.metricLabel()}>
            Coluna com Mais Cards
          </Text>
          <Text as="span" className={styles.metricValue()}>
            {maxColumn?.title ?? '-'}
          </Text>
        </div>
        <div className={styles.metricCard()}>
          <Text as="span" className={styles.metricLabel()}>
            Media por Coluna
          </Text>
          <Text as="span" className={styles.metricValue()}>
            {data.columns.length > 0
              ? Math.round(data.totalTasks / data.columns.length)
              : 0}
          </Text>
        </div>
      </div>

      <div className={styles.chartsGrid()}>
        <div className={styles.chartCard()}>
          <Text as="span" className={styles.chartTitle()}>
            Cards por Coluna
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard()}>
          <Text as="span" className={styles.chartTitle()}>
            Distribuicao por Coluna
          </Text>
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
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
