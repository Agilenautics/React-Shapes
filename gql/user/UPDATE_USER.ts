import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUsers($where: UserWhere, $update: UserUpdateInput) {
    updateUsers(where: $where, update: $update) {
      users {
        emailId
        userType
      }
    }
  }
`;
