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

const ADD_USER = gql`
mutation AddUser($newUser: userInput!) {
  addUser(newUser: $newUser) {
    active
    emailId
    userName
    userType
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
const handleUpdate_User = async (data: Object, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        // @ts-ignore
        id: data.id
      },
      update: {
        // @ts-ignore
        userType: data.accessLevel
      }
    },
    refetchQueries: [{ query }]
  })
}

export { ALL_USERS, DELETE_USER, handleUser_Delete, ADD_USER, UPDATE_USER, handleUpdate_User }