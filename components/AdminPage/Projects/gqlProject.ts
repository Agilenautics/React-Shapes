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
      recycleBin
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
  }).then((res) => {
    admin = res.data.users
  })
  return admin
}

const DELETE_PROJECT = gql`
mutation deleteProject($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
      recycleBin
      name
    }
  }
}
`


const delete_Project = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      },
      update: {
        recycleBin: true
      }
    },
    refetchQueries: [{ query }],
  })

}

//parmenant delete mutation
const PARMENANT_DELETE = gql`
mutation parmenantDelete($where: mainWhere) {
  deleteMains(where: $where) {
    nodesDeleted
  }
}
`

//parmenant delete project
const parmenantDelete = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, query: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      }
    },
    refetchQueries: [{ query }],
  })

}



const ADD_PROJECT = gql`
mutation addProject($where: userWhere, $update: userUpdateInput) {
  updateUsers(where: $where, update: $update) {
    users {
      emailId
      id
      userType
      hasProjects {
        id
        name
        description
        recycleBin
      }
    }
  }
}
`
const EDIT_PROJECT = gql`
mutation Mutation($where: mainWhere, $update: mainUpdateInput) {
  updateMains(where: $where, update: $update) {
    mains {
      name
      description
    }
  }
}
`
const edit_Project = async (id: string, projectName: string, projectDesc: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id
      },
      "update": {
        "name": projectName,
        "description": projectDesc,
      }
    },
    refetchQueries: [{ query: customQuery }]
  })
}


export { GET_PROJECTS, DELETE_PROJECT, delete_Project, ADD_PROJECT, GET_USER, get_user_method, edit_Project, EDIT_PROJECT, parmenantDelete,PARMENANT_DELETE }