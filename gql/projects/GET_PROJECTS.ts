import { gql } from "@apollo/client";
export const GET_PROJECTS = gql`
  query getProjects($where: UserWhere) {
    users(where: $where) {
      id
      userType
      timeStamp
      emailId
      hasProjects {
        id
        name
        timeStamp
        description
        recycleBin
        usersInProjects {
          id
          emailId
        }
      }
    }
  }
`;
