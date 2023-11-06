import {
    gql
  } from "@apollo/client";
  import { File_Fragment } from "./fragments";
  import { Node_Fragment,Info_Fragment } from "../gqlNodes";

 export  const createFileMutation = gql`
${File_Fragment}
  mutation CreateFiles($input: [FileCreateInput!]!) {
  createFiles(input: $input) {
    files{
      ...FileFragment
    }
  }
}
`


export const newFolderInFolder = gql`
  mutation Mutation($where: FolderWhere, $create: FolderRelationInput) {
    updateFolders(where: $where, create: $create) {
      folders {
        name
        hasFolder {
          name
          id
          type
          isOpen
        }
      }
    }
  }
`;

export const newFolderInMain = gql`
  ${Info_Fragment}
  mutation createEpic($input: [FolderCreateInput!]!) {
    createFolders(input: $input) {
      folders {
        id
        isOpen
        name
        type
        uid
        hasInfo {
          ...InfoFragment
        }
        projectHas {
          name
          id
        }
        hasSprint{
          id
          name
        }
      }
    }
  }
`;
export const deleteFiles = gql`
  mutation DeleteFiles($where: FileWhere, $delete: FileDeleteInput) {
    deleteFiles(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
export const deleteFolders = gql`
  mutation DeleteFolders($where: FolderWhere, $delete: FolderDeleteInput) {
    deleteFolders(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
export const updateFoldersMutation = gql`
  mutation UpdateFolders($where: FolderWhere, $update: FolderUpdateInput) {
    updateFolders(where: $where, update: $update) {
      folders {
        id
        name
      }
    }
  }
`;
export const connectToFolderOnMove = gql`
  mutation Mutation($where: FolderWhere, $connect: FolderConnectInput) {
    updateFolders(where: $where, connect: $connect) {
      folders {
        name
        hasFile {
          name
        }
      }
    }
  }
`;
export const disconnectFromFolderOnMove = gql`
  mutation Mutation($where: FolderWhere, $disconnect: FolderDisconnectInput) {
    updateFolders(where: $where, disconnect: $disconnect) {
      folders {
        name
        hasFile {
          name
        }
      }
    }
  }
`;
export const updateFiles = gql`
  mutation updateFiles($where: FileWhere, $update: FileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        id
        name
      }
    }
  }
`;
// updating epic hasInfo data only

export const updateEpicMutation = gql`
  ${Info_Fragment}
  mutation updateEpic($where: FolderWhere, $update: FolderUpdateInput) {
    updateFolders(where: $where, update: $update) {
      folders {
        name
        hasInfo {
          ...InfoFragment
        }
        hasSprint {
          id
          name
        }
      }
    }
  }
`;
//update story  hasInfo data only
export const updateStoryMutation = gql`
  ${Info_Fragment}
  mutation UpdateStory($where: FileWhere, $update: FileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasComments {
          id
          message
          timeStamp
          userHas {
           emailId
          }
        }
        hasInfo {
          ...InfoFragment
        }
        hasSprint {
          id
          name
        }
      }
    }
  }
`;

export const createUidMutation = gql`
mutation CreateUids($input: [UidCreateInput!]!) {
  createUids(input: $input) {
    uids {
      uid
      id
    }
  }
}
`
export const updateUidMutation = gql`
mutation UpdateUids($where: UidWhere, $update: UidUpdateInput) {
  updateUids(where: $where, update: $update) {
    uids {
      id
      uid
    }
  }
}
`

