'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useMutation } from 'urql';
import { useActions } from '@/services/hooks/use-actions';
import { MOVE_TASK } from '@/services/graphql/mutations';
import { BoardColumn } from './board-column/board-column';
import { BoardDndProvider, useBoardDnd } from '../_providers/board-dnd-context';
import { FabCreateTask } from './fab-create-task/fab-create-task';
import { DialogCreateTask } from './dialog-create-task/dialog-create-task';
import { CardTask } from './card-task/card-task';
import type { ActionModel, TaskModel } from '@/schemas';

type Props = {
  initialActions: ActionModel[];
};

export function Board({ initialActions }: Props) {
  const { actions, fetching, error } = useActions({
    initialData: initialActions,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedActions = actions.sort((a, b) => a.position - b.position);
  const firstActionId = sortedActions[0]?.id;
  const columnIds = useMemo(
    () => sortedActions.map((a) => a.id),
    [sortedActions],
  );

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-red-500">
          Erro ao carregar o board: {error.message}
        </p>
      </div>
    );
  }

  return (
    <BoardDndProvider columnIds={columnIds}>
      <main className="relative flex flex-1 gap-4 p-6 overflow-x-auto">
        {fetching && actions.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-zinc-500">Carregando board...</p>
          </div>
        )}
        {!fetching && actions.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-zinc-500">Nenhuma action encontrada</p>
          </div>
        )}

        <BoardDndLayer sortedActions={sortedActions} />

        {firstActionId && (
          <>
            <FabCreateTask onClick={() => setDialogOpen(true)} />
            <DialogCreateTask
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              firstActionId={firstActionId}
            />
          </>
        )}
      </main>
    </BoardDndProvider>
  );
}

type BoardDndLayerProps = {
  sortedActions: ActionModel[];
};

function BoardDndLayer({ sortedActions }: BoardDndLayerProps) {
  const [activeTask, setActiveTask] = useState<TaskModel | null>(null);
  const [, moveTask] = useMutation(MOVE_TASK);
  const { findColumn, getTaskCount, getTaskData } = useBoardDnd();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const taskId = active.id as string;
      const taskData = getTaskData(taskId);
      if (taskData) {
        setActiveTask(taskData);
      }
    },
    [getTaskData],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as string;
      const overId = over.id as string;

      const overColumnId = findColumn(overId);
      if (!overColumnId) return;

      const taskCount = getTaskCount(overColumnId);
      const newPosition = taskCount > 0 ? taskCount : 0;

      moveTask({
        taskId,
        newPosition,
        newActionId: overColumnId,
      });
    },
    [findColumn, getTaskCount, moveTask],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {sortedActions.map((action) => (
        <BoardColumn key={action.id} action={action} />
      ))}

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="opacity-90 rotate-2 scale-105">
            <CardTask task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
