import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";

const getInitData = gql`
  query Mains {
    mains {
      name
      isOpen
      id
      hasContainsFile {
        name
        id
        type
      }
      hasContainsFolder {
        id
        type
        isOpen
        name
        hasFolder {
          name
          id
          type
          isOpen
          hasFile {
            name
            id
            type
            hasflowchart {
              name
              nodes {
                id
                type
                draggable
                flowchart
                hasdataNodedata {
                  label
                  shape
                  description
                  links {
                    label
                    id
                    fileId
                    flag
                  }
                  linkedBy {
                    label
                    id
                    flag
                    fileId
                  }
                }
                haspositionPosition {
                  name
                  x
                  y
                }
              }
              edges {
                selected
                source
                sourceHandle
                target
                targetHandle
                hasedgedataEdgedata {
                  id
                  bidirectional
                  boxCSS
                  label
                  pathCSS
                }
                flownodeConnectedby {
                  flowchart
                  id
                }
                connectedtoFlownode {
                  flowchart
                  id
                }
              }
            }
          }
        }
        hasFile {
          type
          id
          name

          hasflowchart {
            name
            nodes {
              id
              draggable
              flowchart
              type
              hasdataNodedata {
                label
                shape
                description
                links {
                  label
                  id
                  fileId
                  flag
                }
                linkedBy {
                  label
                  id
                  fileId
                  flag
                }
              }
              haspositionPosition {
                name
                x
                y
              }
            }
            edges {
              selected
              source
              sourceHandle
              target
              targetHandle
              hasedgedataEdgedata {
                id
                bidirectional
                boxCSS
                label
                pathCSS
              }
              flownodeConnectedby {
                flowchart
                id
              }
              connectedtoFlownode {
                flowchart
                id
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
          id
          type
          isOpen
        }
      }
    }
  }
`;

const newFolderInMain = gql`
  mutation Mutation($input: [folderCreateInput!]!) {
    createFolders(input: $input) {
      folders {
        id
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
const newFileInFolder = gql`
  mutation UpdateFolders($where: folderWhere, $create: folderRelationInput) {
    updateFolders(where: $where, create: $create) {
      folders {
        name
        hasFile {
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
const connectToFolderOnMove = gql`
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
const disconnectFromFolderOnMove = gql`
mutation Mutation($where: folderWhere, $disconnect: folderDisconnectInput) {
  updateFolders(where: $where, disconnect: $disconnect) {
   folders {
     name
     hasFile {
       name
     }
   } 
  }
}`;

async function createFolderInFolder(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  var node: any;
  await client
    .mutate({
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
    })

    .then((result) => {
      const newFolder = JSON.stringify(
        result.data.updateFolders.folders[0]
      ).replace('"hasFolder":', '"folder":');
      const nodes1 = JSON.parse(newFolder);
      node = nodes1.folder[0];
    });
  return node;
}
async function createFolderInMain(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  var node: any;
  await client
    .mutate({
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
    })
    .then((result) => {
      node = result.data.createFolders.folders[0];
      // const newFolder = JSON.stringify(
      //   result.data.createFolders.folders)
      // .replace('"mainHas":', '"folder":');
      // const nodes1 = JSON.parse(newFolder);
      // node = nodes1.folder[0];
    });
  return node;
}
async function createFileInMain(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  var node: any;
  await client
    .mutate({
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
    })
    .then((result) => {
      console.log(result.data.updateMains.mains);
      const newFile1 = JSON.stringify(
        result.data.updateMains.mains[0]
      ).replace('"hasContainsFile":', '"file":');
      const nodes1 = JSON.parse(newFile1);
      node = nodes1.file[0];
    });
  return node;
}

async function createFileInFolder(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string
) {
  var node: any;
  await client
    .mutate({
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
                      name: "Flowchart",
                    },
                  },
                },
              },
            },
          ],
        },
      },
    })
    .then((result) => {
      const newFile1 = JSON.stringify(
        result.data.updateFolders.folders[0]
      ).replace('"hasFile":', '"file":');
      const nodes1 = JSON.parse(newFile1);
      node = nodes1.file[0];
    });
  return node;
}

interface File {
  name: string;
  id: string;
  type: 'file';
  __typename: 'file';
}

interface Folder {
  id: string;
  type: 'folder';
  isOpen: boolean;
  name: string;
  hasFolder: Folder[];
  hasFile: File[];
  __typename: 'folder';
}

interface Main {
  name: string;
  isOpen: boolean;
  id: string;
  hasContainsFile: File[];
  hasContainsFolder: Folder[];
  __typename: 'main';
}

interface Data {
  mains: Main[];
}

interface RootObject {
  data: Data;
}

function transformObject(root: RootObject): RootObject {
  const transformMain = (main: Main): Main => ({
    ...main,
    children: [
      ...(Array.isArray(main.hasContainsFolder) ? main.hasContainsFolder.map(transformFolder) : []),
      ...(main.hasContainsFile || [])
    ].map((item) => {
      if (item.type === 'file') {
        return item;
      }
      return transformFolder(item);
    }),
    hasContainsFolder: main.hasContainsFolder.map(folder =>
      transformFolder(folder)
    ),
  });

  const transformFolder = (folder: Folder): Folder => ({
    ...folder,
    hasFolder: folder.hasFolder ? folder.hasFolder.map(f => transformFolder(f)) : [],
    children: [
      ...(Array.isArray(folder.hasFolder) ? folder.hasFolder : []),
      ...(folder.hasFile || [])
    ].map(item => {
      if (item.type === 'file') {
        return item;
      }
      return transformFolder(item);
    }),
  });

  const transformData = (data: Data): Data => ({
    ...data,
    mains: data.mains.map(main => transformMain(main)),
  });

  return {
    ...root,
    data: transformData(root.data),
  };
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
      const mainData = result.data.mains
      const data = mainData.map((value: any) => {
       const {hasContainsFile,hasContainsFolder,...rest} = value
       return {...rest,children:hasContainsFolder}
      })
      const nodes1 = JSON.stringify(result.data.mains)
        .replace('"hasContainsFolder":', '"children":')
        .replace('"hasFolder":', '"children":')
        .replace('"hasFile":', '"children":')
        .replace('"hasflowchart":', '"flowchart":');
      // nodes = JSON.parse(nodes1);

      const res_updated = transformObject(result);
      nodes = res_updated.data.mains;

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
                  hasdataNodedata: {
                    delete: {
                      links: {},
                      linkedBy: {},
                    },
                  },
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
                        hasdataNodedata: {
                          delete: {
                            links: {},
                            linkedBy: {},
                          },
                        },
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
const connectToFolderBackendOnMove = async (folderId: any, fileId: string) => {
  await client.mutate({
    mutation: connectToFolderOnMove,
    variables: {
      where: {
        id: folderId,
      },
      connect: {
        hasFile: [
          {
            where: {
              node: {
                id: fileId,
              },
            },
          },
        ],
      },
    },
  });
};
const disconnectFromFolderBackendOnMove = async (fileId: string) => {
  await client.mutate({
    mutation: disconnectFromFolderOnMove,
    variables: {

      "where": {
        "hasFile_SINGLE": {
          "id": fileId,
        }
      },
      "disconnect": {
        "hasFile": [
          {
            "disconnect": {}
          }
        ]
      }
    }
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

const getFile = gql`
 query Query($where: fileWhere) {
  files(where: $where) {
    name
    id
    type
    hasflowchart {
      name
      nodes {
        draggable
        flowchart
        id
        hasdataNodedata {
          label
          shape
          description
          links {
            fileId
             flag
             id
             label
          }
          linkedBy {
            id
            fileId
            flag
            label
          }
        }
        haspositionPosition {
          x
          y
        }
      }
    }
  }
}
`

const getFileByNode = async (nodeId: string, customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
  let file: any
  await client.query({
    query: customQuery,
    variables: {
      "where": {
        "hasflowchart": {
          "nodes_SINGLE": {
            "id": nodeId
          }
        }
      }
    }
  }).then((result) => {
    file = result
  })
  return file
}

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
  disconnectFromFolderBackendOnMove,
  connectToFolderBackendOnMove,
  getFile,
  getFileByNode
};
