import client from "../../apollo-client";
import {
    gql, DocumentNode,
    TypedDocumentNode,
    OperationVariables,
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
// // input variable for getting sprint
// {
//     "where": {
//       "hasProjects": {
//         "id": "06c94e7b-2a73-41b1-9683-61662706823a"
//       }
//     }
//   }

const SPRINTS_FOR_BACKLOGS= gql`
query Sprints($where: sprintWhere) {
  sprints(where: $where) {
    id
    name
  }
}
`

// // input variable for getting sprint
// {
//     "where": {
//       "hasProjects": {
//         "id": "06c94e7b-2a73-41b1-9683-61662706823a"
//       }
//     }
//   }



const CREATE_SPRINT_MUTATION = gql`
mutation CreateSprints($input: [sprintCreateInput!]!, $where: mainWhere) {
  createSprints(input: $input) {
    sprints {
      id
      name
      description
      timeStamp
      startDate
      endDate
      hasProjects {
        name
      }
    }
  }
}
`

const createSPrintBackend = async (projectId: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, inputVariables: Sprint) => {
    // await client.mutate({
    //     input:[]
    // })

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






