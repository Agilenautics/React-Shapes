import { NextApiResponse } from "next";
import client from "../../apollo-client";
import {
  gql, DocumentNode,
  TypedDocumentNode,
  OperationVariables,
  FetchResult,
} from '@apollo/client'

export interface Sprint {
  id: string;
  name?: string | null;
  description: string;
  timeStamp: string
  startDate: string
  endDate: string
}



//get sprint by the project id
const GET_SPRINTS = gql`
query Sprints($where: sprintWhere) {
  sprints(where: $where) {
    id
    name
    description
    timeStamp
    startDate
    endDate
    folderHas {
      id
      name
      type
      hasInfo {
        assignedTo
        status
        description
        dueDate
      }
    }
    fileHas {
      id
      name
      type
      hasInfo {
        status
        description
        assignedTo
        dueDate
      }
    }
    flownodeHas {
      id
      type
      hasInfo {
        status
        assignedTo
        dueDate
      }
      hasdataNodedata {
        label
        description
      }
    }
  }
}
`
const getSprintByProjectId = async (projectId: string, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>, updateSprints: any) => {
  let sprint
  await client.query({
    query: customQuery,
    variables: {
      where: {
        hasProjects: {
          id: projectId
        }
      }
    }
  }).then((response) => {
    const { data, loading, error } = response
    updateSprints(data.sprints, loading, error)
    sprint = response
  })
    .catch((error) => {
      return error
    })
}


const SPRINTS_FOR_BACKLOGS = gql`
query Sprints($where: sprintWhere) {
  sprints(where: $where) {
    id
    name
  }
}
`
const getSprintToBacklogs = (projectId: string, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  client.query({
    query: customQuery,
    variables: {
      where: {
        hasProjects: {
          id: projectId
        }
      }
    }
  }).then((response) => {
    return response;
  })
    .catch((error) => error)
}



const CREATE_SPRINT_MUTATION = gql`
mutation CreateSprints($input: [sprintCreateInput!]!) {
  createSprints(input: $input) {
    sprints {
      id
      name
      description
      startDate
      endDate
      timeStamp
      hasProjects {
        name
      }
    }
  }
}
`

const createSPrintBackend = async (projectId: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, inputVariables: Sprint, addSprint: any, handleError: any,sprintCreateMessage:any,hidePopUp:any) => {
  await client.mutate({
    mutation: mutation,
    variables: {
      input: [
        {
          hasProjects: {
            connect: {
              where: {
                node: {
                  id: projectId
                }
              }
            }
          },
          name: inputVariables.name,
          description: inputVariables.description||"",
          startDate: inputVariables.startDate,
          endDate: inputVariables.endDate
        }
      ]
    }
  }).then((response: FetchResult<any>) => {
    addSprint(response.data.createSprints.sprints[0], response.errors)
    sprintCreateMessage()
    hidePopUp(false)
  }).catch((error) => handleError(error))

}

const UPDATE_SPRINT_MUTATION = gql`
mutation updateSprint($where: sprintWhere, $update: sprintUpdateInput) {
  updateSprints(where: $where, update: $update) {
    sprints {
      name
      description
      startDate
      endDate
    }
  }
}
`

// update sprint
// {
//     "where": {
//       "id": null
//     },
//     "update": {
//       "name": null,
//       "description": null,
//       "startDate": null,
//       "endDate": null
//     },

//   }



const DELETE_SPRINT = gql`
mutation DeleteSprints($where: sprintWhere) {
  deleteSprints(where: $where) {
    nodesDeleted
    relationshipsDeleted
  }
}
`

// delete sprint
// {
//     "where": {
//      "id":""
//     }
//   }
// }

const CONNECT_TO_STORY = gql`
mutation UpdateSprints($where: sprintWhere, $connect: sprintConnectInput) {
  updateSprints(where: $where, connect: $connect) {
    sprints {
      name
      fileHas {
        name
      }
    }
  }
}
`

// add story to sprint

// {
//     "where": {
//     "id": "12bbe55a-bd58-45a4-9dc5-bdb3c4c5ffbe"
//     },
//     "connect": {
//       "fileHas": [
//         {
//           "where": {
//             "node": {
//             "id": "f32eafd7-911e-433c-a8c9-a4e01afa4eed"
//             }
//           }
//         }
//       ]
//     }
//   }

// connect to epic

const CONNECT_TO_EPIC = gql`
mutation UpdateSprints($where: sprintWhere, $connect: sprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
        name
        folderHas {
          name
        }
      }
    }
  }
`

//sprint connect to epic
// {
//     "where": {
//       "id": "12bbe55a-bd58-45a4-9dc5-bdb3c4c5ffbe"
//     },
//     "connect": {
//       "folderHas": [
//         {
//           "where": {
//             "node": {
//               "id": "7426d03f-d1b9-48cc-a5c5-422d1d45258c"
//             }
//           }
//         }
//       ]
//     }
//   }


//sprint to task

const CONNECT_TO_TASK = gql`
mutation UpdateSprints($where: sprintWhere, $connect: sprintConnectInput) {
  updateSprints(where: $where, connect: $connect) {
    sprints {
      name
      flownodeHas {
        hasdataNodedata {
          label
        }
      }
    }
  }
}
`

// input variables
// {
//     "where": {
//       "id": "12bbe55a-bd58-45a4-9dc5-bdb3c4c5ffbe"
//     },
//     "connect": {
//       "flownodeHas": [
//         {
//           "where": {
//             "node": {
//               "id": "6a0557a1-29ee-4816-b56c-986e21fc54e3"
//             }
//           }
//         }
//       ]
//     }
//   }


export { GET_SPRINTS, getSprintByProjectId, SPRINTS_FOR_BACKLOGS, getSprintToBacklogs, createSPrintBackend, CREATE_SPRINT_MUTATION }



