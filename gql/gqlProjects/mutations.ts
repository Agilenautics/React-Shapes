import { gql } from "@apollo/client";
import { Project_Fragment } from "./fragments";

export const ADD_PROJECT = gql`
${Project_Fragment}
mutation createProject($input: [ProjectCreateInput!]!) {
  createProjects(input: $input) {
    projects {
      ...ProjectFragment
    }
  }
}
`
export const DELETE_PROJECT = gql`
${Project_Fragment}
mutation deleteProject($where: ProjectWhere, $update: ProjectUpdateInput) {
  updateProjects(where: $where, update: $update) {
    projects {
     ...ProjectFragment
    }
  }
}
`

export const EDIT_PROJECT = gql`
mutation Mutation($where: ProjectWhere, $update: ProjectUpdateInput) {
  updateProjects(where: $where, update: $update) {
    projects {
      name
      description
    }
  }
}
`



export const recentProject_mutation = gql`
${Project_Fragment}
mutation updateRecentProject($where: ProjectWhere, $update: ProjectUpdateInput) {
  updateProjects(where: $where, update: $update) {
    projects {
    ...ProjectFragment
    }
  }
}

`

//parmenant delete mutation
export const PARMENANT_DELETE = gql`
mutation parmenantDelete($where: ProjectsWhere) {
  deleteProjects(where: $where) {
    nodesDeleted
  }
}
`
//clear reCycle bin
export const CLEAR_RECYCLE_BIN = gql`
mutation clearBin($where: ProjectWhere, $delete: ProjectDeleteInput) {
  deleteProjects(where: $where, delete: $delete) {
    relationshipsDeleted
  }
}`



