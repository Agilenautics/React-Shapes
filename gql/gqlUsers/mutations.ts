import {gql} from "@apollo/client";
export const ALL_USERS = gql`
query getUsers {
  users {
    active
    emailId
    userType
    userName
    id
    timeStamp
    hasProjects {
      id
      name
    }
  }
}
`
export const GET_USERS_ByProject = gql`
query Query($where: userWhere) {
  users(where: $where) {
   emailId 
   userType
  }
}`
export const DELETE_USER = gql`
mutation deleteUser($where: userWhere, $delete: userDeleteInput) {
  deleteUsers(where: $where, delete: $delete) {
    nodesDeleted
  }
}`
export const ADD_USER = gql`
mutation CreateUsers($input: [userCreateInput!]!) {
  createUsers(input: $input) {
    users {
      userType
      active
      id
      timeStamp
      hasProjects {
      name
      }
    }
  }
}
`
export const UPDATE_USER = gql`
mutation UpdateUsers($where: userWhere, $update: userUpdateInput) {
  updateUsers(where: $where, update: $update) {
    info {
      bookmark
    }
  }
}
`
//assign  project to users mutation
export const allocateProjectToUserMutation = gql`
mutation assignProjectToUser($connect: userConnectInput, $where: userWhere) {
  updateUsers(connect: $connect, where: $where) {
    users {
      id
      hasProjects {
        name
      }
    }
  }
}
`
export const deAllocateProjectToUserMutation = gql`
  mutation UpdateUsers($disconnect: userDisconnectInput, $where: userWhere) {
    updateUsers(disconnect: $disconnect, where: $where) {
      info {
        relationshipsDeleted
      }
    }
  }
  `
  




