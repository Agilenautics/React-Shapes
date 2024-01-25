import { gql } from "@apollo/client";

export const createFileMutation = gql`
  mutation CreateFiles($input: [FileCreateInput!]!) {
    createFiles(input: $input) {
      files {
        type
        id
        name
        uid
        hasSprint {
          id
          name
        }
        projectHas {
          id
          name
        }
        hasComments {
          id
          message
          timeStamp
          createdBy {
            emailId
          }
        }
        folderHas {
          id
          name
        }
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasNodes {
          id
          draggable
          flowchart
          type
          timeStamp
          uid
          label
          shape
          x
          y
          flowEdge {
            id
            label
            bidirectional
            boxCSS
            pathCSS
            selected
            createdBy {
              id
              emailId
            }

            flowNodeConnection {
              edges {
                handle
                node {
                  id
                }
              }
            }
          }
          isLinked {
            id
            label
            isLinkedConnection {
              edges {
                from
              }
            }
            hasFile {
              id
            }
          }
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          hasComments {
            message
            createdBy {
              emailId
            }
          }
          hasSprint {
            id
            name
          }
          hasFile {
            id
            name
            folderHas {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const newFolderInMain = gql`
  mutation createEpic($input: [FolderCreateInput!]!) {
    createFolders(input: $input) {
      folders {
        id
        isOpen
        name
        type
        uid
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasFile {
          type
          id
          name
          uid
          hasSprint {
            id
            name
          }
          projectHas {
            id
            name
          }
          hasComments {
            id
            message
            timeStamp
            createdBy {
              emailId
            }
          }
          folderHas {
            id
            name
          }
          hasInfo {
            description
            assignedTo
            status
            dueDate
          }
          hasNodes {
            id
            draggable
            flowchart
            type
            timeStamp
            uid
            label
            shape
            x
            y
            flowEdge {
              id
              label
              bidirectional
              boxCSS
              pathCSS
              selected
              createdBy {
                id
                emailId
              }

              flowNodeConnection {
                edges {
                  handle
                  node {
                    id
                  }
                }
              }
            }
            isLinked {
              id
              label
              isLinkedConnection {
                edges {
                  from
                }
              }
              hasFile {
                id
              }
            }
            hasInfo {
              description
              assignedTo
              status
              dueDate
            }
            hasComments {
              message
              createdBy {
                emailId
              }
            }
            hasSprint {
              id
              name
            }
            hasFile {
              id
              name
              folderHas {
                id
                name
              }
            }
          }
        }
        projectHas {
          name
          id
        }
        hasSprint {
          id
          name
        }
      }
    }
  }
`;
export const deleteFilesMutation = gql`
  mutation DeleteFiles($where: FileWhere, $delete: FileDeleteInput) {
    deleteFiles(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
export const deleteFoldersMutation = gql`
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
// export const connectToFolderOnMove = gql`
//   mutation Mutation($where: FolderWhere, $connect: FolderConnectInput) {
//     updateFolders(where: $where, connect: $connect) {
//       folders {
//         name
//         hasFile {
//           name
//         }
//       }
//     }
//   }
// `;
// export const disconnectFromFolderOnMove = gql`
//   mutation Mutation($where: FolderWhere, $disconnect: FolderDisconnectInput) {
//     updateFolders(where: $where, disconnect: $disconnect) {
//       folders {
//         name
//         hasFile {
//           name
//         }
//       }
//     }
//   }
// `;
export const moveFileMutation = gql`
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
export const updateFilesMutation = gql`
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
  mutation updateEpic($where: FolderWhere, $update: FolderUpdateInput) {
    updateFolders(where: $where, update: $update) {
      folders {
        name
        hasInfo {
          description
          assignedTo
          status
          dueDate
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
  mutation UpdateStory($where: FileWhere, $update: FileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasComments {
          id
          message
          timeStamp
          createdBy {
            emailId
          }
        }
        hasInfo {
          description
          assignedTo
          status
          dueDate
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
`;
export const updateUidMutation = gql`
  mutation UpdateUids($where: UidWhere, $update: UidUpdateInput) {
    updateUids(where: $where, update: $update) {
      uids {
        id
        uid
      }
    }
  }
`;
