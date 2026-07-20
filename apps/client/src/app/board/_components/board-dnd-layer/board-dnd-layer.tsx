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
import { useTasksSubscription } from '@/services/hooks/use-tasks-subscription';
import { useActionsSubscription } from '@/services/hooks/use-actions-subscription';
import { MOVE_TASK } from '@/services/graphql/mutations';
import { BoardColumn } from '../board-column/board-column';
import { useBoardDnd } from '../../_providers/board-dnd-context';
import { CardTask } from '../card-task/card-task';
import type { ActionModel, TaskModel } from '@/schemas';

type BoardDndLayerProps = {
  sortedActions: ActionModel[];
};

export function BoardDndLayer({ sortedActions }: BoardDndLayerProps) {
  const [activeTask, setActiveTask] = useState<TaskModel | null>(null);
  const [, moveTask] = useMutation(MOVE_TASK);
  const { findColumn, getTaskCount, getTaskData, getTaskIndex } = useBoardDnd();

  useTasksSubscription();
  useActionsSubscription();

  const columnIds = useMemo(
    () => sortedActions.map((a) => a.id),
    [sortedActions],
  );

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

      const isOverTask = !columnIds.includes(overId);
      let newPosition = getTaskCount(overColumnId);

      if (isOverTask) {
        const overIndex = getTaskIndex(overId);
        if (overIndex !== null) {
          newPosition = overIndex;
        }
      }

      moveTask({
        taskId,
        newPosition,
        newActionId: overColumnId,
      }).then(({ error }) => {
        if (error) {
          console.error('Erro ao mover task:', error.message);
        }
      });
    },
    [findColumn, getTaskCount, getTaskIndex, moveTask, columnIds],
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
