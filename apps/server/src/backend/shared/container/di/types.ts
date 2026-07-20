export const TYPES = {
  Database: Symbol.for('Database'),
  PubSub: Symbol.for('PubSub'),
  Cache: Symbol.for('Cache'),
  Repositories: {
    Action: Symbol.for('ActionRepository'),
    Task: Symbol.for('TaskRepository'),
  },
};
