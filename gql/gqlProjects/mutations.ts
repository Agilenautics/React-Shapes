import { gql } from "@apollo/client";
import { Project_Fragment } from "./fragments";

export const DELETE_PROJECT = gql`
${Project_Fragment}
mutation deleteProject($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
     ...ProjectFragment
    }
  }
}
`

export const ADD_PROJECT = gql`
${Project_Fragment}
mutation createProject($input: [mainCreateInput!]!) {
  createMains(input: $input) {
    mains {
      ...ProjectFragment
    }
  }
}
`


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
  query getUser($where: userWhere) {
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
export const EDIT_PROJECT = gql`
mutation Mutation($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
      name
      description
    }
  }
}
`



export const recentProject_mutation = gql`
${Project_Fragment}
mutation updateRecentProject($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
    ...ProjectFragment
    }
  }
}

`

//parmenant delete mutation
export const PARMENANT_DELETE = gql`
mutation parmenantDelete($where: mainWhere) {
  deleteMains(where: $where) {
    nodesDeleted
  }
}
`
//clear reCycle bin

export const CLEAR_RECYCLE_BIN = gql`
mutation clearBin($where: mainWhere, $delete: mainDeleteInput) {
  deleteMains(where: $where, delete: $delete) {
    relationshipsDeleted
  }
}`



