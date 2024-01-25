import { gql } from "@apollo/client";

export const CREATE_SPRINT_MUTATION = gql`
  mutation CreateSprints($input: [SprintCreateInput!]!) {
    createSprints(input: $input) {
      sprints {
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
            description
            assignedTo
            status
            dueDate
          }
        }
        fileHas {
          id
          name
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
        }
        flownodeHas {
          id
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          data {
            label
            description
          }
        }
        hasProjects {
          name
        }
      }
    }
  }
`;
export const UPDATE_SPRINT_MUTATION = gql`
  mutation updateSprint($where: SprintWhere, $update: SprintUpdateInput) {
    updateSprints(where: $where, update: $update) {
      sprints {
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
            description
            assignedTo
            status
            dueDate
          }
        }
        fileHas {
          id
          name
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
        }
        flownodeHas {
          id
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          data {
            label
            description
          }
        }
        hasProjects {
          name
        }
      }
    }
  }
`;
export const DELETE_SPRINT = gql`
  mutation DeleteSprints($where: SprintWhere) {
    deleteSprints(where: $where) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
export const CONNECT_TO_STORY = gql`
  mutation connectToStory($where: SprintWhere, $connect: SprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
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
            description
            assignedTo
            status
            dueDate
          }
        }
        fileHas {
          id
          name
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
        }
        flownodeHas {
          id
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          data {
            label
            description
          }
        }
        hasProjects {
          name
        }
      }
    }
  }
`;
export const CONNECT_TO_EPIC = gql`
  mutation connectToEpic($where: SprintWhere, $connect: SprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      sprints {
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
            description
            assignedTo
            status
            dueDate
          }
        }
        fileHas {
          id
          name
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
        }
        flownodeHas {
          id
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          data {
            label
            description
          }
        }
        hasProjects {
          name
        }
      }
    }
  }
`;
export const CONNECT_TO_TASK = gql`
  mutation connectToTask($where: SprintWhere, $connect: SprintConnectInput) {
    updateSprints(where: $where, connect: $connect) {
      Sprints {
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
            description
            assignedTo
            status
            dueDate
          }
        }
        fileHas {
          id
          name
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
        }
        flownodeHas {
          id
          type
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          data {
            label
            description
          }
        }
        hasProjects {
          name
        }
      }
    }
  }
`;
