import { gql } from "@apollo/client";

export const ADD_PROJECT = gql`
  mutation createProject($input: [ProjectCreateInput!]!) {
    createProjects(input: $input) {
      projects {
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
export const DELETE_PROJECT = gql`
  mutation deleteProject($where: ProjectWhere, $update: ProjectUpdateInput) {
    updateProjects(where: $where, update: $update) {
      projects {
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

export const EDIT_PROJECT = gql`
  mutation Mutation($where: ProjectWhere, $update: ProjectUpdateInput) {
    updateProjects(where: $where, update: $update) {
      projects {
        name
        description
      }
    }
  }
`;

export const recentProject_mutation = gql`
  mutation updateRecentProject(
    $where: ProjectWhere
    $update: ProjectUpdateInput
  ) {
    updateProjects(where: $where, update: $update) {
      projects {
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

//parmenant delete mutation
export const PARMENANT_DELETE = gql`
  mutation DeleteProjects($where: ProjectWhere, $delete: ProjectDeleteInput) {
    deleteProjects(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
//clear reCycle bin
export const CLEAR_RECYCLE_BIN = gql`
  mutation DeleteProjects($where: ProjectWhere, $delete: ProjectDeleteInput) {
    deleteProjects(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
