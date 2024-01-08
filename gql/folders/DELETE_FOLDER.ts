import { gql } from "@apollo/client";

export const DELETE_FOLDER = gql`
  mutation DeleteFolder($delete: FolderDeleteInput, $where: FolderWhere) {
    deleteFolders(delete: $delete, where: $where) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
