import { gql } from "@apollo/client";

export const RECYCLE_PROJECT = gql`
  # moving project from recycleBin page into project page
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
