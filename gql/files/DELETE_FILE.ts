import { gql } from "@apollo/client";

export const DELETE_FILE = gql`
  mutation DeleteFile($where: FileWhere, $delete: FileDeleteInput) {
    deleteFiles(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
