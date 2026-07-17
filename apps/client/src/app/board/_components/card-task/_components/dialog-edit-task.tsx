'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'urql';
import { Dialog } from 'radix-ui';
import { UPDATE_TASK } from '@/services/graphql/mutations';
import { editDialogStyles } from './dialog-edit-task.tv';

type EditTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  initialTitle: string;
  initialDescription: string | null;
};

export function EditTaskDialog({
  open,
  onOpenChange,
  taskId,
  initialTitle,
  initialDescription,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? '');
  const [updateResult, updateTask] = useMutation(UPDATE_TASK);

  const styles = editDialogStyles();

  const isSubmitting = updateResult.fetching;

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription ?? '');
    }
  }, [open, initialTitle, initialDescription]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    updateTask({
      id: taskId,
      title: trimmedTitle,
      description: description.trim() || undefined,
    }).then((result) => {
      if (!result.error) {
        onOpenChange(false);
      }
    });
  }

  function handleCancel() {
    setTitle(initialTitle);
    setDescription(initialDescription ?? '');
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay()} />
        <Dialog.Content className={styles.content()}>
          <Dialog.Title className={styles.title()}>Editar task</Dialog.Title>
          <Dialog.Description className={styles.description()}>
            Altere os dados da task.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className={styles.form()}>
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input()}
              autoFocus
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={styles.textarea()}
            />

            <div className={styles.footer()}>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.buttonCancel()}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className={styles.buttonSubmit()}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
