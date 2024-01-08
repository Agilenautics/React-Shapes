import {gql} from "@apollo/client";

export const UPDATE_FILE = gql`
  mutation Mutation(
    $where: FileWhere
    $disconnect: FileDisconnectInput
    $connect: FileConnectInput
  ) {
    updateFiles(where: $where, disconnect: $disconnect, connect: $connect) {
      files {
        name
        folderHas {
          name
        }
        projectHas {
          name
        }
      }
    }
  }
`;
