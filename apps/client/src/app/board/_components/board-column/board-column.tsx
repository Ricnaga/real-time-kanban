'use client';

import { ScrollArea } from 'radix-ui';
import { useTasksByAction } from '@/services/hooks/use-tasks';
import { boardColumnStyles } from './board-column.tv';
import { CardTask } from '../card-task/card-task';
import type { ActionModel } from '@/schemas';

type BoardColumnProps = {
  action: ActionModel;
};

export function BoardColumn({ action }: BoardColumnProps) {
  const { tasks, fetching } = useTasksByAction(action.id);
  const styles = boardColumnStyles();

  return (
    <section className={styles.base()} aria-label={action.title}>
      <header className={styles.header()}>
        <h2 className={styles.title()}>{action.title}</h2>
        <span className={styles.count()}>{tasks.length}</span>
      </header>
      <ScrollArea.Root className={styles.scrollArea()}>
        <ScrollArea.Viewport className={styles.scrollViewport()}>
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
          <ul className={styles.list()} role="list">
            {tasks.map((task) => (
              <CardTask key={task.id} task={task} />
            ))}
          </ul>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </section>
  );
}
