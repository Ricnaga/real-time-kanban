import { gql } from '@urql/core';

export const CREATE_ACTION = gql`
  mutation CreateAction($title: String!, $step: String!) {
    createAction(title: $title, step: $step) {
      id
      title
      step
      position
    }
  }
`;

export const MOVE_ACTION = gql`
  mutation MoveAction($actionId: ID!, $newPosition: Int!) {
    moveAction(actionId: $actionId, newPosition: $newPosition) {
      id
      title
      step
      position
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String, $actionId: ID!) {
    createTask(title: $title, description: $description, actionId: $actionId) {
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

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String) {
    updateTask(id: $id, title: $title, description: $description) {
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

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const MOVE_TASK = gql`
  mutation MoveTask($taskId: ID!, $newPosition: Int!, $newActionId: ID) {
    moveTask(
      taskId: $taskId
      newPosition: $newPosition
      newActionId: $newActionId
    ) {
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
