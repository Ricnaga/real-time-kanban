import { gql } from '@urql/core';

export const ON_ACTION_CREATED = gql`
  subscription OnActionCreated {
    actionCreated {
      id
      title
      step
      position
    }
  }
`;

export const ON_ACTION_MOVED = gql`
  subscription OnActionMoved {
    actionMoved {
      id
      title
      step
      position
    }
  }
`;

export const ON_TASK_CREATED = gql`
  subscription OnTaskCreated {
    taskCreated {
      id
      title
      description
      position
      actionId
      createdAt
      updatedAt
    }
  }
`;

export const ON_TASK_UPDATED = gql`
  subscription OnTaskUpdated {
    taskUpdated {
      id
      title
      description
      position
      actionId
      createdAt
      updatedAt
    }
  }
`;

export const ON_TASK_DELETED = gql`
  subscription OnTaskDeleted {
    taskDeleted
  }
`;

export const ON_TASK_MOVED = gql`
  subscription OnTaskMoved {
    taskMoved {
      id
      title
      description
      position
      actionId
      createdAt
      updatedAt
    }
  }
`;
