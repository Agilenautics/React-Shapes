import {gql} from "@apollo/client";

export const DELETE_USER = gql`
mutation deleteUser($where: UserWhere, $delete: UserDeleteInput) {
  deleteUsers(where: $where, delete: $delete) {
    nodesDeleted
  }
}`
export const ADD_USER = gql`
mutation CreateUsers($input: [UserCreateInput!]!) {
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
mutation UpdateUsers($where: UserWhere, $update: UserUpdateInput) {
  updateUsers(where: $where, update: $update) {
    Info {
      bookmark
    }
  }
}
`
//assign  project to users mutation
export const allocateProjectToUserMutation = gql`
mutation assignProjectToUser($connect: UserConnectInput, $where: UserWhere) {
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
  mutation UpdateUsers($disconnect: UserDisconnectInput, $where: UserWhere) {
    updateUsers(disconnect: $disconnect, where: $where) {
      info {
        relationshipsDeleted
      }
    }
  }
  `
  




