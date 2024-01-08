import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation CreateUsers($input: [UserCreateInput!]!) {
    createUsers(input: $input) {
      users {
        id
        active
        emailId
        timeStamp
        userType
        userName
        hasProjects {
          id
          name
        }
      }
    }
  }
`;
