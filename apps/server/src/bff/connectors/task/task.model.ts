export type TaskModel = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  actionId: string;
  createdAt: Date;
  updatedAt: Date;
};
