import { gql } from "@apollo/client";
export const DELETE_USER = gql`
  mutation DeleteUsers($where: UserWhere) {
    deleteUsers(where: $where) {
      nodesDeleted
    }
  }
`;
