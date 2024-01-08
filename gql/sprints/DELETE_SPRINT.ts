import { gql } from "@apollo/client";

export const DELETE_SPRINT = gql`
  mutation DeleteSprints($where: SprintWhere) {
    deleteSprints(where: $where) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
