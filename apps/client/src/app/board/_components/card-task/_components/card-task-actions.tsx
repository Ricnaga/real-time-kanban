import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cardTaskActionsStyles } from './card-task-actions.tv';

type CardTaskActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function CardTaskActions({ onEdit, onDelete }: CardTaskActionsProps) {
  const styles = cardTaskActionsStyles();

  return (
    <div className={styles.divider()}>
      <div className={styles.actions()}>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Editar task"
          className={styles.button()}
        >
          <PencilIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Deletar task"
          className={styles.button()}
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
