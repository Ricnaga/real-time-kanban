'use client';

import { useTasksByAction } from '@/services/hooks/use-tasks';
import { columnStyles } from './column.tv';
import type { ActionModel } from '@/schemas';

type ColumnProps = {
  action: ActionModel;
};

export function Column({ action }: ColumnProps) {
  const { tasks, fetching } = useTasksByAction(action.id);
  const styles = columnStyles();

  return (
    <div className={styles.base()}>
      <div className={styles.header()}>
        <h2 className={styles.title()}>{action.title}</h2>
        <span className={styles.count()}>{tasks.length}</span>
      </div>
      <div className={styles.list()}>
        {fetching && tasks.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            Carregando...
          </p>
        )}
        {!fetching && tasks.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            Nenhuma task
          </p>
        )}
        {tasks.map((task) => (
          <div key={task.id} className={styles.card()}>
            <span className={styles.cardTitle()}>{task.title}</span>
            {task.description && (
              <span className={styles.cardDescription()}>
                {task.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
