import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      id
      emailId
      timeStamp
      userType
      hasProjects {
        id
        name
      }
    }
  }
`;
