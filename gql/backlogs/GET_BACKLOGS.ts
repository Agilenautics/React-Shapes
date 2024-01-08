import { gql } from "@apollo/client";

export const GET_BACKLOGS = gql`
  query getAllBacklogs($where: ProjectWhere) {
    projects(where: $where) {
      id
      name
      # recycleBin it
      hasContainsFolder {
        id
        type
        name
        hasFile {
          id
          name
          type
          uid
          hasInfo {
            assignedTo
            description
            status
          }
          hasNodes {
            id
            type
            label
            hasInfo {
              assignedTo
              status
              description
              dueDate
            }
          }
        }
      }
      hasContainsFile {
        id
        name
        type
        uid
        folderHas {
          id
          name
        }
        hasInfo {
          assignedTo
          dueDate
          description
          status
        }
        hasNodes {
          id
          type
          label
          hasFile {
            id
            name
          }
          hasInfo {
            assignedTo
            status
            description
            dueDate
          }
        }
      }
    }
  }
`;
