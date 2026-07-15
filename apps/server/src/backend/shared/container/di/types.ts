export const TYPES = {
  Database: Symbol.for('Database'),
  PubSub: Symbol.for('PubSub'),
  Repositories: {
    Action: Symbol.for('ActionRepository'),
    Task: Symbol.for('TaskRepository'),
  },
};
