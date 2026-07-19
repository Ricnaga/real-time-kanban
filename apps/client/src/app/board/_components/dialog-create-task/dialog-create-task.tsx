'use client';

import { SubmitEvent, useState, useId } from 'react';
import { useMutation } from 'urql';
import { Dialog } from 'radix-ui';
import { CREATE_TASK } from '@/services/graphql/mutations';
import { Label } from '@/components/typography/label/label';
import { dialogStyles } from './dialog-create-task.tv';

type DialogCreateTaskProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstActionId: string;
};

export function DialogCreateTask({
  open,
  onOpenChange,
  firstActionId,
}: DialogCreateTaskProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createTaskResult, createTask] = useMutation(CREATE_TASK);
  const titleId = useId();
  const descriptionId = useId();

  const styles = dialogStyles();

  const isSubmitting = createTaskResult.fetching;

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createTask({
      title: trimmedTitle,
      description: description.trim() || undefined,
      actionId: firstActionId,
    }).then((result) => {
      if (!result.error) {
        setTitle('');
        setDescription('');
        onOpenChange(false);
      }
    });
  }

  function handleCancel() {
    setTitle('');
    setDescription('');
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay()} />
        <Dialog.Content className={styles.content()}>
          <Dialog.Title className={styles.title()}>Criar task</Dialog.Title>
          <Dialog.Description className={styles.description()}>
            Adicione uma nova task ao board.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className={styles.form()}>
            <Label htmlFor={titleId}>Título</Label>
            <input
              id={titleId}
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input()}
              autoFocus
            />
            <Label htmlFor={descriptionId}>Descrição</Label>
            <textarea
              id={descriptionId}
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
                {isSubmitting ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
