import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Node_Fragment, Edge_Fragment } from "../Flow/Nodes/gqlNodes";
// import backlogStore from "../Backlogs/backlogStore";
//@ Irfan we have to create project and connect with Admin na, y we need this?
const createProjectMutation = gql`
  mutation createProject($input: [mainCreateInput!]!) {
    createMains(input: $input) {
      mains {
        name
        description
        isOpen
        userName
        id
      }
    }
  }
`;
//@ Irfan check this too
// create project methode
const createProject = async (
  data: any,
  mutations: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation: mutations,
    variables: {
      input: {
        name: data.name,
        description: data.description,
        userName: "",
        isOpen: true,
      },
    },
  });
};
export const Info_Fragment = gql`
  fragment InfoFragment on info {
    description
    assignedTo
    status
    dueDate
    sprint
  }
`;

const File_Fragment = gql`
  ${Node_Fragment}
  ${Edge_Fragment}
  ${Info_Fragment}
  fragment FileFragment on file {
    type
    id
    name
    hasSprint {
      id
      name
    }
    hasInfo{
    ...InfoFragment
    }
    hasflowchart {
      name
      nodes {
        ...NodeFragment
      }
      edges {
        ...EdgeFragment
      }
    }
  }
`;

//Get root using unique userName(UID)
const getMainByUser = gql`
  ${File_Fragment}
  ${Info_Fragment}
  query Query($where: mainWhere) {
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
  ${Info_Fragment}
  mutation createEpic($input: [folderCreateInput!]!) {
    createFolders(input: $input) {
      folders {
        id
        isOpen
        name
        type
        hasInfo {
          ...InfoFragment
        }
        mainHas {
          name
          id
        }
      }
    }
  }
`;
const newFileInMain = gql`
  ${File_Fragment}
  mutation createStory($where: mainWhere, $create: mainRelationInput) {
    updateMains(where: $where, create: $create) {
      mains {
        name
        hasContainsFile {
          ...FileFragment
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
  }
`;

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
            hasInfo: {
              create: {
                node: {
                  status: "To-Do",
                  assignedTo: "",
                  dueDate: "",
                  description: "",
                  sprint: "",
                },
              },
            },
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
      // console.log(result.data.createFolders);
    });
  return node;
}
async function createFileInMain(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string,
  data: any
) {
  // const addRow = backlogStore((state) => state.addRow);
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
                name: data.name,
                hasInfo: {
                  create: {
                    node: {
                      status: data.status,
                      assignedTo: "",
                      dueDate: "",
                      description: data.descrition,
                      sprint: "",
                    },
                  },
                },
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
      // console.log(result.data.updateMains.mains);
      const newFile1 = JSON.stringify(result.data.updateMains.mains[0]).replace(
        '"hasContainsFile":',
        '"file":'
      );
      const nodes1 = JSON.parse(newFile1);
      node = nodes1.file[0];
      // addRow(data);
    });
  return node;
}

// creat story mutation
const newFileInFolder = gql`
  ${File_Fragment}
  mutation createStory($where: folderWhere, $create: folderRelationInput) {
    updateFolders(where: $where, create: $create) {
      folders {
        name
        hasFile {
          ...FileFragment
        }
      }
    }
  }
`;

// creating story method
async function createFileInFolder(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string,
  data: any
) {
  // const addRow = backlogStore((state) => state.addRow);
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
                name: data.name,
                hasInfo: {
                  create: {
                    node: {
                      status: data.status,
                      assignedTo: "",
                      dueDate: "",
                      description: data.description,
                      sprint: "",
                    },
                  },
                },
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
      update: (cache, result) => {
        //// console.log(result);
      },
      refetchQueries: [{ query: getMainByUser }],
      onQueryUpdated(observableQuery) {
        // Define any custom logic for determining whether to refetch
        if (observableQuery) {
          return observableQuery.refetch();
        }
      },
    })
    .then((result) => {
      const newFile1 = JSON.stringify(
        result.data.updateFolders.folders[0]
      ).replace('"hasFile":', '"file":');
      const nodes1 = JSON.parse(newFile1);
      node = nodes1.file[0];
      // addRow(data);
    });
  return node;
}

interface File {
  name: string;
  id: string;
  hasflowchart: any;
  flowchart: any;
  type: "file";
  __typename: "file";
}

interface Folder {
  id: string;
  type: "folder";
  isOpen: boolean;
  name: string;
  hasFolder: Folder[];
  hasFile: File[];
  children: (Folder | File)[];
  __typename: "folder";
}

interface Main {
  name: string;
  isOpen: boolean;
  id: string;
  hasContainsFile: File[];
  hasContainsFolder: Folder[];
  children: (Folder | File)[];
  __typename: "main";
  userHas: File[];
  description: string;
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
      ...(Array.isArray(main.hasContainsFolder)
        ? main.hasContainsFolder.map(transformFolder)
        : []),
      ...(main.hasContainsFile || []),
    ].map((item) => {
      if (item.type === "file") {
        return item;
      }
      return transformFolder(item);
    }),
    hasContainsFolder: main.hasContainsFolder.map((folder) =>
      transformFolder(folder)
    ),
  });

  const transformFolder = (folder: Folder): Folder => ({
    ...folder,
    hasFolder: folder.hasFolder
      ? folder.hasFolder.map((f) => transformFolder(f))
      : [],
    children: [
      ...(Array.isArray(folder.hasFolder) ? folder.hasFolder : []),
      ...(folder.hasFile || []),
    ].map((item) => {
      if (item.type === "file") {
        return {
          ...item,
          flowchart: item.hasflowchart,
        };
      }
      return transformFolder(item);
    }),
  });

  const transformData = (data: Data): Data => ({
    ...data,
    mains: data.mains.map((main) => transformMain(main)),
  });

  return {
    ...root,
    data: transformData(root.data),
  };
}
async function getTreeNodeByUser(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string,
  setLoading: any
) {
  var nodes: Array<Main> = [];

  await client
    .query({
      query: customQuery,
      variables: {
        where: {
          id,
        },
      },
    })
    .then((result) => {
      const mainData = result.data.mains;
      const data = mainData.map((value: any) => {
        const { hasContainsFile, hasContainsFolder, ...rest } = value;
        return { ...rest, children: hasContainsFolder };
      });
      const res_updated = transformObject(result);
      nodes = res_updated.data.mains;
      setLoading(result.loading);
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
      where: {
        hasFile_SINGLE: {
          id: fileId,
        },
      },
      disconnect: {
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

const getFileByNode = async (
  nodeId: string,
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  let file: any;
  await client
    .query({
      query: customQuery,
      variables: {
        where: {
          hasflowchart: {
            nodes_SINGLE: {
              id: nodeId,
            },
          },
        },
      },
    })
    .then((result) => {
      file = result;
    });
  return file;
};

// updating epic hasInfo data only

const updateEpicMutation = gql`
  ${Info_Fragment}
  mutation updateEpic($where: folderWhere, $update: folderUpdateInput) {
    updateFolders(where: $where, update: $update) {
      folders {
        name
        hasInfo {
          ...InfoFragment
        }
      }
    }
  }
`;

const updateEpic = async (
  id: string,
  epictData: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  const { status, description, assignedTo, dueDate, sprint } = epictData;
  await client.mutate({
    mutation,
    variables: {
      where: {
        id,
      },
      update: {
        hasInfo: {
          update: {
            node: {
              status,
              sprint,
              dueDate,
              description,
              assignedTo,
            },
          },
        },
      },
    },
  });
};

const updateStoryMethod = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  storyData: any
) => {
  // const updateRow = backlogStore((state) => state.updateRow);
  const { status, description, assignedTo, dueDate, sprint } = storyData;
  const response = await client
    .mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        update: {
          hasInfo: {
            update: {
              node: {
                status,
                sprint,
                dueDate,
                description,
                assignedTo,
              },
            },
          },
        },
      },
    })

    return response;
};

//update story  hasInfo data only
const updateStoryMutation = gql`
  ${Info_Fragment}
  mutation UpdateStory($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasInfo {
          ...InfoFragment
        }
      }
    }
  }
`;

export {
  createFolderInMain,
  newFolderInMain,
  createFolderInFolder,
  newFolderInFolder,
  // getInitData,
  // getTreeNode,
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
  getFileByNode,
  createProject,
  createProjectMutation,
  getMainByUser,
  getTreeNodeByUser,
  updateEpicMutation,
  updateEpic,
  updateStoryMethod,
  updateStoryMutation,
};
