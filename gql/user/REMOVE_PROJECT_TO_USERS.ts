import { gql } from "@apollo/client";

export const REMOVE_PROJECT_TO_USER = gql`
  mutation UpdateUsers($where: UserWhere, $disconnect: UserDisconnectInput) {
    updateUsers(where: $where, disconnect: $disconnect) {
      info {
        relationshipsDeleted
      }
    }
  }
`;
