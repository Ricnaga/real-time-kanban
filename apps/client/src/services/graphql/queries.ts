import { gql } from '@urql/core';

export const GET_ACTIONS = gql`
  query GetActions {
    actions {
      id
      title
      step
      position
    }
  }
`;

export const GET_TASKS_BY_ACTION = gql`
  query GetTasksByAction($actionId: ID!) {
    tasksByAction(actionId: $actionId) {
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
