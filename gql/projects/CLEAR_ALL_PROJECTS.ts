import { gql } from "@apollo/client";

export const CLEAR_ALL_PROJECT = gql`
  # clear all project inside the recycle bin
  mutation DeleteProjects($where: ProjectWhere, $delete: ProjectDeleteInput) {
    deleteProjects(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
