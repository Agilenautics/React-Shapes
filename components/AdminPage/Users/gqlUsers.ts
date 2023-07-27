import { DocumentNode, OperationVariables, TypedDocumentNode, gql } from "@apollo/client";
import client from "../../../apollo-client";


const ALL_USERS = gql`
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
const GET_USERS_ByProject = gql`
query Query($where: userWhere) {
  users(where: $where) {
   emailId 
   userType
  }
}`
const DELETE_USER = gql`
mutation deleteUser($where: userWhere, $delete: userDeleteInput) {
  deleteUsers(where: $where, delete: $delete) {
    nodesDeleted
  }
}`

const handleUser_Delete = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      }
    },
    refetchQueries: [{ query }]
  })
}

// const ADD_USER = gql`
// mutation AddUser($newUser: userInput!) {
//   addUser(newUser: $newUser) {
//     active
//     emailId
//     userName
//     userType
//   }
// }
// `

const ADD_USER = gql`
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


const UPDATE_USER = gql`
mutation UpdateUsers($where: userWhere, $update: userUpdateInput) {
  updateUsers(where: $where, update: $update) {
    info {
      bookmark
    }
  }
}
`



const handleUpdate_User = async (id:string,userType:string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        // @ts-ignore
        id
      },
      update: {
        // @ts-ignore
        userType
      }
    },
    refetchQueries: [{ query }]
  })
}
const handleGetUsersByProject = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      }
    },
    refetchQueries: [{ query }]
  })
}


//assign  project to users mutation
const allocateProjectToUserMutation = gql`
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


const allocateProjectToUserMethod = async (projectId: string, userId: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id: userId
      },
      connect: {
        hasProjects: [
          {
            where: {
              node: {
                id: projectId
              }
            }
          }
        ]
      }
    }
  })
}

const deAllocateProjectToUserMutation = gql`
mutation UpdateUsers($disconnect: userDisconnectInput, $where: userWhere) {
  updateUsers(disconnect: $disconnect, where: $where) {
    info {
      relationshipsDeleted
    }
  }
}
`

const deAllocateProjectToUserMethod = async (projectId: string, userId: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id: userId
      },
      disconnect: {
        hasProjects: [
          {
            where: {
              node: {
                id: projectId
              }
            }
          }
        ]
      }
    }
  })
}



export { ALL_USERS, DELETE_USER, handleUser_Delete,
   ADD_USER, UPDATE_USER, handleUpdate_User, 
   allocateProjectToUserMethod, allocateProjectToUserMutation,
   deAllocateProjectToUserMethod,deAllocateProjectToUserMutation,
  GET_USERS_ByProject,handleGetUsersByProject}