import { gql } from "@apollo/client";

export const UPDATE_FOLDER = gql`
  mutation UpdateFolders($where: FolderWhere, $update: FolderUpdateInput) {
    updateFolders(where: $where, update: $update) {
      folders {
        id
        name
      }
    }
  }
`;
