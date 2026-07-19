'use client';

import { useEffect, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ScrollArea } from 'radix-ui';
import { useTasksByAction } from '@/services/hooks/use-tasks';
import { useBoardDnd } from '../../_providers/board-dnd-context';
import { boardColumnStyles } from './board-column.tv';
import { CardTask } from '../card-task/card-task';
import { Heading } from '@/components/typography/heading/heading';
import { Text } from '@/components/typography/text/text';
import type { ActionModel } from '@/schemas';

type BoardColumnProps = {
  action: ActionModel;
};

export function BoardColumn({ action }: BoardColumnProps) {
  const { tasks, fetching } = useTasksByAction(action.id);
  const styles = boardColumnStyles();
  const { registerTaskCount } = useBoardDnd();

  const { setNodeRef } = useDroppable({ id: action.id });

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  useEffect(() => {
    registerTaskCount(action.id, tasks.length);
  }, [action.id, tasks.length, registerTaskCount]);

  return (
    <section
      ref={setNodeRef}
      className={styles.base()}
      aria-label={action.title}
    >
      <header className={styles.header()}>
        <Heading as="h2" size="1" className="uppercase tracking-wide">
          {action.title}
        </Heading>
        <Text as="span" size="1" color="muted" className={styles.count()}>
          {tasks.length}
        </Text>
      </header>
      <ScrollArea.Root className={styles.scrollArea()}>
        <ScrollArea.Viewport className={styles.scrollViewport()}>
          {fetching && tasks.length === 0 && (
            <Text as="p" size="2" color="muted" className="text-center py-4">
              Carregando...
            </Text>
          )}
          {!fetching && tasks.length === 0 && (
            <Text as="p" size="2" color="muted" className="text-center py-4">
              Nenhuma task
            </Text>
          )}
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            <ul className={styles.list()} role="list">
              {tasks.map((task) => (
                <CardTask key={task.id} task={task} />
              ))}
            </ul>
          </SortableContext>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </section>
  );
}
