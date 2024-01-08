import { gql } from "@apollo/client";

export const ADD_PROJECT_TO_USER = gql`
  mutation assignProjectToUser($where: UserWhere, $connect: UserConnectInput) {
    updateUsers(where: $where, connect: $connect) {
      users {
        emailId
        hasProjects {
          id
          name
        }
      }
    }
  }
`;
