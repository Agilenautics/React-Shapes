import { gql } from "@apollo/client";

export const GET_FILES_FOLDERS_BY_PROJECT_ID = gql`
  query getFilesAndFoldersByProjectId($where: ProjectWhere) {
    projects(where: $where) {
      id
      name
      isOpen
      hasContainsFolder {
        id
        isOpen
        name
        type
        hasFile {
          id
          name
          type
        }
      }
      hasContainsFile {
        id
        type
        name
      }
    }
  }
`;
