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
mutation addProject($newProject: projectInput!) {
  createProject(newProject: $newProject) {
    name
    description
    isOpen
    userName
  }
}
`





export { GET_PROJECTS, DELETE_PROJECT, delete_Project,ADD_PROJECT }