import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
const newFileInFolder = gql`
  mutation UpdateFolders($where: folderWhere, $create: folderRelationInput) {
    updateFolders(where: $where, create: $create) {
      folders {
        name
        hasFile {
          name
        }
      }
    }
  }
`;
// const getInitData=gql`
// query Query($where: mainWhere) {
//   mains(where: $where) {
//     mainHasChildren {
//       hasContainsFolder {
//         name
//       }
//       hasContainsFile {
//         name
//       }
//     }
//   }
// }`

const getInitData = gql`
  query Mains {
    mains {
      name
      isOpen
      id
      hasContainsFile {
        name
        id
      }
      hasContainsFolder {
        id
        type
        isOpen
        name
        hasFolder {
          name
          hasFile {
            name
            hasflowchart {
              nodes {
                type
              }
            }
          }
        }
        hasFile {
          type
          id
          name
          hasflowchart {
            nodes {
              id
              draggable
              flowchart
              type
              hasdataNodedata {
                label
                shape
                description
              }
              haspositionPosition {
                x
                y
              }
            }
          }
        }
      }
    }
  }
`;
const deleteFolders = gql`
  mutation DeleteFolders($where: folderWhere, $delete: folderDeleteInput) {
    deleteFolders(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;
const deleteFiles = gql`
  mutation DeleteFiles($where: fileWhere, $delete: fileDeleteInput) {
    deleteFiles(where: $where, delete: $delete) {
      nodesDeleted
    }
  }
`;

const newFolderInFolder = gql`
  mutation Mutation($where: folderWhere, $create: folderRelationInput) {
    updateFolders(where: $where, create: $create) {
      folders {
        name
        hasFolder {
          name
        }
      }
    }
  }
`;

const newFolderInMain = gql`
  mutation Mutation($input: [folderCreateInput!]!) {
    createFolders(input: $input) {
      folders {
        isOpen
        name
        type
        mainHas {
          name
          id
        }
      }
    }
  }
`;
const newFileInMain = gql`
  mutation Mutation($where: mainWhere, $create: mainRelationInput) {
    updateMains(where: $where, create: $create) {
      mains {
        name
        hasContainsFile {
          id
          name
          type
          hasflowchart {
            name
          }
        }
      }
    }
  }
`;
const updateFiles = gql`
  mutation UpdateFiles($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        id
        name
      }
    }
  }
`;
const updateFolders = gql`
  mutation UpdateFolders($where: folderWhere, $update: folderUpdateInput) {
    updateFolders(where: $where, update: $update) {
      folders {
        id
        name
      }
    }
  }
`;

async function createFolderInFolder(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  await client.mutate({
    mutation: mutation,
    variables: {
      where: {
        id: parentId,
      },
      create: {
        hasFolder: [
          {
            node: {
              type: "folder",
              isOpen: false,
              name: "FolderInFolder",
            },
          },
        ],
      },
    },
  });

  // if (flowchart) {
  //   client.resetStore().then(() => {
  //     getNodes(allNodes, flowchart).then((res) => {
  //       console.log("create node",res);
  //       return updateNode(res)
  //     })
  //   }).catch((error) => {

  //     console.error(error);
  //   });
  // }
}
async function createFolderInMain(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  await client.mutate({
    mutation: mutation,
    variables: {
      input: [
        {
          type: "folder",
          isOpen: false,
          name: "New Folder",
          mainHas: {
            connect: {
              where: {
                node: {
                  id: parentId,
                },
              },
            },
          },
        },
      ],
    },
  });
  // client
  // .resetStore()
  // .then((res) => {
  //   console.log("cache restoring.......");
  //   getTreeNode(getInitData);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
}
async function createFileInMain(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  await client.mutate({
    mutation: mutation,
    variables: {
      where: {
        id: parentId,
      },
      create: {
        hasContainsFile: [
          {
            node: {
              type: "file",
              name: "FileInMain2",
              hasflowchart: {
                create: {
                  node: {
                    name: "flowchart",
                  },
                },
              },
            },
          },
        ],
      },
    },
  });
}

async function createFileInFolder(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  await client.mutate({
    mutation: mutation,
    variables: {
      where: {
        id: parentId,
      },
      create: {
        hasFile: [
          {
            node: {
              type: "file",
              name: "New File",
              hasflowchart: {
                create: {
                  node: {
                    name: "New File",
                  },
                },
              },
            },
          },
        ],
      },
    },
  });
}

async function getTreeNode(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) {
  var nodes: Array<Node> = [];
  await client
    .query({
      query: customQuery,
    })
    .then((result) => {
      const nodes1 = JSON.stringify(result.data.mains)
        .replaceAll('"hasContainsFolder":', '"children":')
        .replaceAll('"hasFolder":', '"children":')
        .replaceAll('"hasFile":', '"children":')
        .replaceAll('"hasFlownodes":', '"flowchart":');
      nodes = JSON.parse(nodes1);
    });
  return nodes;
}

async function deleteFileBackend(fileID: string) {
  await client.mutate({
    mutation: deleteFiles,
    variables: {
      where: {
        id: fileID,
      },
      delete: {
        hasflowchart: {
          delete: {
            nodes: [
              {
                delete: {
                  hasdataNodedata: {},
                  haspositionPosition: {},
                },
              },
            ],
            edges: [
              {
                delete: {
                  hasedgedataEdgedata: {},
                },
              },
            ],
          },
        },
      },
    },
  });
}

async function deleteFolderBackend(folderID: string) {
  await client.mutate({
    mutation: deleteFolders,
    variables: {
      where: {
        id: folderID,
      },
      delete: {
        hasFile: [
          {
            delete: {
              hasflowchart: {
                delete: {
                  nodes: [
                    {
                      delete: {
                        hasdataNodedata: {},
                        haspositionPosition: {},
                      },
                    },
                  ],
                  edges: [
                    {
                      delete: {
                        hasedgedataEdgedata: {},
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  });
}

const updateFolderBackend = async (folderId: string, name: string) => {
  await client.mutate({
    mutation: updateFolders,
    variables: {
      where: {
        id: folderId,
      },
      update: {
        name: name,
      },
    },
  });
};

const updateFileBackend = async (fileId: string, flowchart: string) => {
  await client.mutate({
    mutation: updateFiles,
    variables: {
      where: {
        id: fileId,
      },
      update: {
        name: flowchart,
      },
    },
  });
};

export {
  createFolderInMain,
  newFolderInMain,
  createFolderInFolder,
  newFolderInFolder,
  getInitData,
  getTreeNode,
  createFileInFolder,
  newFileInFolder,
  deleteFileBackend,
  updateFileBackend,
  updateFolderBackend,
  deleteFolderBackend,
  createFileInMain,
  newFileInMain,
};
