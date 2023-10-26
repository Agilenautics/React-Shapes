import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import {
  deleteFiles,
  connectToFolderOnMove,
  disconnectFromFolderOnMove,
  updateFiles,
} from "./mutations";
import { Main, transformObject } from "./interfaces";
import client from "../../apollo-client";

// create File (story)

const createFile = async (
  mainId: string,
  folderId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileData: any
) => {
  let node;
  await client
    .mutate({
      mutation,
      variables: {
        input: {
          name: fileData.name,
          uid: fileData.uid,

          type: fileData.type || "file",
          hasInfo: {
            create: {
              node: {
                status: "To-Do",
                assignedTo: "",
                dueDate: "",
                // @ts-ignore
                description: fileData.discription || "",
                sprint: "",
              },
            },
          },
          folderHas: {
            connect: {
              where: {
                node: {
                  id: folderId || "",
                },
              },
            },
          },
          mainHas: {
            connect: {
              where: {
                node: {
                  id: mainId || "",
                },
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
    })
    .then((result) => {
      node = result.data.createFolders.files[0];
      
    })
    .catch((error) => {
      console.log("Error in creating file", error);
    });
  return node;
};

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
async function deleteFileBackend(fileID: string, deleteItem: any) {
  client
    .mutate({
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
    })
    .then((res) => {
      if (res.data) {
        deleteItem(fileID);
      }
      if (res.errors) {
        return (
          res.errors && (
            <div> {res.errors.map((values) => values.message)} </div>
          )
        );
      }
    })
    .catch((error) => {
      console.error("Error deleting the file", error);
    });
}
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

const updateStoryMethod = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  storyData: any
) => {
  // const updateRow = backlogStore((state) => state.updateRow);
  const { name, status, description, assignedTo, dueDate, sprint, discussion } =
    storyData;

  const response = await client.mutate({
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
        hasSprint: {
          connect: [
            {
              where: {
                node: {
                  id: sprint || "",
                },
              },
            },
          ],
        },
        comments: [
          {
            create: [
              {
                node: {
                  message: discussion,
                  user: {
                    connect: {
                      where: {
                        node: {
                          emailId: "irfan123@gmail.com",
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    },
  });

  return response;
};

export {
  deleteFileBackend,
  updateFileBackend,
  disconnectFromFolderBackendOnMove,
  connectToFolderBackendOnMove,
  getFileByNode,
  getTreeNodeByUser,
  updateStoryMethod,
  createFile
};
