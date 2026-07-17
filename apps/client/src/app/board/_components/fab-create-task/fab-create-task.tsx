import { PlusIcon } from '@heroicons/react/24/outline';
import { fabStyles } from './fab-create-task.tv';

type FabCreateTaskProps = {
  onClick: () => void;
};

export function FabCreateTask({ onClick }: FabCreateTaskProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Criar task"
      className={fabStyles()}
    >
      <PlusIcon className="size-6" />
    </button>
  );
}
