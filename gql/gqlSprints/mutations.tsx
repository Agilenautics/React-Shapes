
import {
  gql
} from "@apollo/client";
import { Sprint_Fragment } from "./fragments";



export const CREATE_SPRINT_MUTATION = gql`
  ${Sprint_Fragment}
  mutation CreateSprints($input: [SprintCreateInput!]!) {
    createSprints(input: $input) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const UPDATE_SPRINT_MUTATION = gql`
  mutation updateSprint($where: SprintWhere, $update: SprintUpdateInput) {
    updateSprints(where: $where, update: $update) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const DELETE_SPRINT = gql`
  mutation DeleteSprints($where: SprintWhere) {
    deleteSprints(where: $where) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
export const CONNECT_TO_STORY = gql`
  ${Sprint_Fragment}
  mutation connectToStory($where: SprintWhere, $connect: SprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const CONNECT_TO_EPIC = gql`
  ${Sprint_Fragment}
  mutation connectToEpic($where: SprintWhere, $connect: SprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const CONNECT_TO_TASK = gql`
  ${Sprint_Fragment}
  mutation connectToTask($where: SprintWhere, $connect: SprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      Sprints {
        ...SprintFragment
      }
    }
  }
`;