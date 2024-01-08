import { gql } from "@apollo/client";

export const UPDATED_USER = gql`
  mutation UpdateUsers($where: UserWhere, $update: UserUpdateInput) {
    updateUsers(where: $where, update: $update) {
      users {
        emailId
        userType
      }
    }
  }
`;
