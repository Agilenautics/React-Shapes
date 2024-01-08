import { gql } from "@apollo/client";

export const UPDATE_PROJECT = gql`
  mutation UpdateProjects($where: ProjectWhere, $update: ProjectUpdateInput) {
    updateProjects(where: $where, update: $update) {
      projects {
        id
        name
        description
      }
    }
  }
`;
