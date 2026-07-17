import { useState } from 'react';
import { cardTaskStyles } from './card-task.tv';
import { CardTaskActions } from './_components/card-task-actions';
import { DeleteTaskDialog } from './_components/delete-task-dialog';
import { EditTaskDialog } from './_components/edit-task-dialog';
import type { TaskModel } from '@/schemas';

type CardTaskProps = {
  task: TaskModel;
};

export function CardTask({ task }: CardTaskProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <li className={cardTaskStyles()}>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {task.title}
        </span>
        {task.description && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
            {task.description}
          </span>
        )}
        <CardTaskActions
          onEdit={() => setEditDialogOpen(true)}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      </li>

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
  );
}
