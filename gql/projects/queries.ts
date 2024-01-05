import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query getProjets {
    projects {
      id
      isOpen
      name
      timeStamp
      userName
      description
    }
  }
`;

// export const GET_PROJECTS_BY_ID = gql`
//   query Projects {
//     projects {
//       id
//       isOpen
//       name
//       recentProject
//       recycleBin
//       timeStamp
//       userName
//       deletedAT
//       description
//     }
//   }
// `;

export const UserSheme = gql`
  query GetUsers {
    getUsers {
      emailId
    }
  }
`;

export const GET_USER = gql`
  query getUser($where: UserWhere) {
    users(where: $where) {
      active
      id
      userName
      userType
      emailId
      hasProjects {
        id
        timeStamp
        description
        name
        recycleBin
        recentProject
        deletedAT
        usersInProjects {
          emailId
          userType
        }
      }
    }
  }
`;
