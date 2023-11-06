import { gql } from "@apollo/client";
import { Project_Fragment } from "./fragments";



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

export const GET_PROJECTS_BY_ID = gql`
  query Projects {
    projects {
      id
      isOpen
      name
      recentProject
      recycleBin
      timeStamp
      userName
      deletedAT
      description
    }
  }
`;

export const UserSheme = gql`
  query GetUsers {
    getUsers {
      emailId
    }
  }
`;

export const GET_USER = gql`
  ${Project_Fragment}
  query getUser($where: UserWhere) {
    users(where: $where) {
      active
      id
      userName
      userType
      emailId
      hasProjects {
        ...ProjectFragment
      }
    }
  }
`;
