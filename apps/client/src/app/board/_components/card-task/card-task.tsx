import { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardDnd } from '../../_providers/board-dnd-context';
import { cardTaskStyles } from './card-task.tv';
import { CardTaskActions } from './card-task-actions/card-task-actions';
import { DeleteTaskDialog } from './dialog-delete-task/dialog-delete-task';
import { EditTaskDialog } from './dialog-edit-task/dialog-edit-task';
import { Text } from '@/components/typography/text/text';
import type { TaskModel } from '@/schemas';

type CardTaskProps = {
  task: TaskModel;
  isOverlay?: boolean;
};

export function CardTask({ task, isOverlay = false }: CardTaskProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { registerTask, unregisterTask, registerTaskData } = useBoardDnd();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isOverlay });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isOverlay) return;
    registerTask(task.id, task.actionId);
    registerTaskData(task.id, task);
    return () => unregisterTask(task.id);
  }, [task, isOverlay, registerTask, registerTaskData, unregisterTask]);

  return (
    <>
      <li
        ref={setNodeRef}
        className={cardTaskStyles({ dragging: isDragging })}
        style={!isOverlay ? style : undefined}
        {...attributes}
        {...listeners}
      >
        <Text as="span" size="2" weight="medium">
          {task.title}
        </Text>
        {task.description && (
          <Text as="span" size="1" color="muted" className="mt-1 line-clamp-2">
            {task.description}
          </Text>
        )}
        <CardTaskActions
          onEdit={() => setEditDialogOpen(true)}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      </li>

      {!isOverlay && (
        <>
          <EditTaskDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            taskId={task.id}
            initialTitle={task.title}
            initialDescription={task.description}
          />

          <DeleteTaskDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            taskId={task.id}
            taskTitle={task.title}
          />
        </>
      )}
    </>
  );
}
