import {
    gql
  } from "@apollo/client";
  import { File_Fragment } from "./fragments";
  import { Node_Fragment,Info_Fragment } from "../gqlNodes";

 export  const createFileMutation = gql`
${File_Fragment}
  mutation CreateFiles($input: [fileCreateInput!]!) {
  createFiles(input: $input) {
    files{
      ...FileFragment
    }
  }
}
`
//Get root using unique userName(UID)
export const getMainByUser = gql`
  ${File_Fragment}
  ${Info_Fragment}
  query getMainByUser($where: mainWhere) {
    mains(where: $where) {
      name
      description
      isOpen
      id
      
      hasContainsFile {
        ...FileFragment
      }
      hasContainsFolder {
        id
        type
        isOpen
        name
        uid
        hasSprint {
         id
         name
        }   
        hasInfo{
         ...InfoFragment
        }
        hasFolder {
          name
          id
          type
          isOpen
          uid
          hasSprint {
            id
            name
          }
          hasInfo{
          ...InfoFragment
          }
          hasFile {
            ...FileFragment
          }
        }
        hasFile {
          ...FileFragment
        }
      }
      userHas {
        emailId
        userType
      }
    }
  }
`;


export const newFolderInFolder = gql`
  mutation Mutation($where: folderWhere, $create: folderRelationInput) {
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
  mutation createEpic($input: [folderCreateInput!]!) {
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
        mainHas {
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
  mutation DeleteFiles($where: fileWhere, $delete: fileDeleteInput) {
    deleteFiles(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
export const deleteFolders = gql`
  mutation DeleteFolders($where: folderWhere, $delete: folderDeleteInput) {
    deleteFolders(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
export const updateFolders = gql`
  mutation UpdateFolders($where: folderWhere, $update: folderUpdateInput) {
    updateFolders(where: $where, update: $update) {
      folders {
        id
        name
      }
    }
  }
`;
export const connectToFolderOnMove = gql`
  mutation Mutation($where: folderWhere, $connect: folderConnectInput) {
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
  mutation Mutation($where: folderWhere, $disconnect: folderDisconnectInput) {
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
  mutation UpdateFiles($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        id
        name
      }
    }
  }
`;
export const getFile = gql`
  ${Node_Fragment}
  query Query($where: fileWhere) {
    files(where: $where) {
      name
      id
      type
      hasflowchart {
        name
        nodes {
          ...NodeFragment
        }
      }
    }
  }
`;
// updating epic hasInfo data only

export const updateEpicMutation = gql`
  ${Info_Fragment}
  mutation updateEpic($where: folderWhere, $update: folderUpdateInput) {
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
  mutation UpdateStory($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        comments {
          id
          message
          timeStamp
          user {
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

//getting uid 
export const getUidQuery = gql`
  query Uids {
  uids {
    id
    uid
  }
}
`
export const createUidMutation = gql`
mutation CreateUids($input: [uidCreateInput!]!) {
  createUids(input: $input) {
    uids {
      uid
      id
    }
  }
}
`
export const updateUidMutation = gql`
mutation UpdateUids($where: uidWhere, $update: uidUpdateInput) {
  updateUids(where: $where, update: $update) {
    uids {
      id
      uid
    }
  }
}
`

