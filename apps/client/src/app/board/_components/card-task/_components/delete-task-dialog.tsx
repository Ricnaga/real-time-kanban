'use client';

import { useMutation } from 'urql';
import { Dialog } from 'radix-ui';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { DELETE_TASK } from '@/services/graphql/mutations';
import { deleteDialogStyles } from './delete-task-dialog.tv';

type DeleteTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
};

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskId,
  taskTitle,
}: DeleteTaskDialogProps) {
  const [deleteResult, deleteTask] = useMutation(DELETE_TASK);
  const styles = deleteDialogStyles();

  const isDeleting = deleteResult.fetching;

  function handleDelete() {
    deleteTask({ id: taskId }).then((result) => {
      if (!result.error) {
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay()} />
        <Dialog.Content className={styles.content()}>
          <div className={styles.icon()}>
            <ExclamationTriangleIcon className="size-12" />
          </div>
          <Dialog.Title className={styles.title()}>Deletar task</Dialog.Title>
          <Dialog.Description className={styles.description()}>
            Tem certeza que deseja deletar{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              &ldquo;{taskTitle}&rdquo;
            </span>
            ? Esta ação não pode ser desfeita.
          </Dialog.Description>

          <div className={styles.footer()}>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className={styles.buttonCancel()}
              >
                Cancelar
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={styles.buttonDelete()}
            >
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
