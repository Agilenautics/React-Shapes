import {
    gql
  } from "@apollo/client";
  import { Sprint_Fragment } from "./fragments";
  
//get sprint by the project id
export const GET_SPRINTS = gql`
  ${Sprint_Fragment}
  query Sprints($where: SprintWhere) {
    sprints(where: $where) {
      ...SprintFragment
    }
  }
`;
export const SPRINTS_FOR_BACKLOGS = gql`
  query Sprints($where: SprintWhere) {
    sprints(where: $where) {
      id
      name
    }
  }
`;
  