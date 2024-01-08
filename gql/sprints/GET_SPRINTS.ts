import { gql } from "@apollo/client";

export const GET_SPRINTS = gql`
  query Sprints($where: SprintWhere) {
    sprints(where: $where) {
      id
      name
      fileHas {
        id
        name
        type
        hasInfo {
          assignedTo
          status
          dueDate
          description
        }
      }
      folderHas {
        id
        name
        type
        hasInfo {
          assignedTo
          description
          dueDate
          status
        }
      }
      flownodeHas {
        id
        label
        type
        hasInfo {
          dueDate
          assignedTo
          status
          description
        }
      }
    }
  }
`;
