import { DocumentNode, OperationVariables, TypedDocumentNode, gql } from "@apollo/client";
import client from "../../../apollo-client";

const GET_PROJECTS = gql`
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
`
const DELETE_PROJECT = gql`
mutation deleteProject($where: mainWhere) {
  deleteMains(where: $where) {
    nodesDeleted
  }
}
`

const GET_USER = gql`
query getUser($where: userWhere) {
  users(where: $where) {
    active
    id
    userName
    userType
    hasProjects {
      id
      timeStamp
      description
      name
    }
  }
}
`

const get_user_method = async (email: String, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {

  let admin = {}

  await client.query({
    query: customQuery,
    variables: {
      where: {
        emailId: email
      }
    }
  }).then((res)=>{
    admin = res.data.users
  })

  return admin

}


const delete_Project = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      }
    },
    refetchQueries: [{ query: GET_PROJECTS }],
  })

}


const ADD_PROJECT = gql`
mutation Mutation($where: userWhere, $update: userUpdateInput) {
  updateUsers(where: $where, update: $update) {
    users {
      emailId
      id
      userType
      hasProjects {
        id
        name
        description
      }
    }
  }
}
`





export { GET_PROJECTS, DELETE_PROJECT, delete_Project, ADD_PROJECT, GET_USER,get_user_method }