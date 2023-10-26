
import {
  gql
} from "@apollo/client";
import { Sprint_Fragment } from "./fragments";




//get sprint by the project id
export const GET_SPRINTS = gql`
  ${Sprint_Fragment}
  query Sprints($where: sprintWhere) {
    sprints(where: $where) {
      ...SprintFragment
    }
  }
`;
export const SPRINTS_FOR_BACKLOGS = gql`
  query Sprints($where: sprintWhere) {
    sprints(where: $where) {
      id
      name
    }
  }
`;
export const CREATE_SPRINT_MUTATION = gql`
  ${Sprint_Fragment}
  mutation CreateSprints($input: [sprintCreateInput!]!) {
    createSprints(input: $input) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const UPDATE_SPRINT_MUTATION = gql`
  mutation updateSprint($where: sprintWhere, $update: sprintUpdateInput) {
    updateSprints(where: $where, update: $update) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const DELETE_SPRINT = gql`
  mutation DeleteSprints($where: sprintWhere) {
    deleteSprints(where: $where) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
export const CONNECT_TO_STORY = gql`
  ${Sprint_Fragment}
  mutation connectToStory($where: sprintWhere, $connect: sprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const CONNECT_TO_EPIC = gql`
  ${Sprint_Fragment}
  mutation connectToEpic($where: sprintWhere, $connect: sprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;
export const CONNECT_TO_TASK = gql`
  ${Sprint_Fragment}
  mutation connectToTask($where: sprintWhere, $connect: sprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        ...SprintFragment
      }
    }
  }
`;