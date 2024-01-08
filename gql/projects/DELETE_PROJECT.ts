import { gql } from "@apollo/client";

export const DELETE_PROJECT = gql`
  # moving project from projects page to recycleBin project
  mutation deleteProject($where: ProjectWhere, $update: ProjectUpdateInput) {
    updateProjects(where: $where, update: $update) {
      projects {
        id
        recycleBin
        deletedAT
      }
    }
  }
`;
