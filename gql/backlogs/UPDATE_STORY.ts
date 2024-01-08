import { gql } from "@apollo/client";

export const UPDATE_STORY = gql`
  mutation UpdateFiles($where: FileWhere, $update: FileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        id
        name
        hasInfo {
          description
          dueDate
          status
          assignedTo
        }
      }
    }
  }
`;
