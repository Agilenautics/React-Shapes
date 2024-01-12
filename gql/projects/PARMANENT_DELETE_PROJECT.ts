import { gql } from "@apollo/client";

export const PARMANENT_DELETE = gql`
  # Parmenent delete
  mutation DeleteProjects($where: ProjectWhere, $delete: ProjectDeleteInput) {
    deleteProjects(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
