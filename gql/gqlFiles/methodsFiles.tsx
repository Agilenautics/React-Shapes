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
import { Project, transformObject } from "./interfaces";
import client from "../../apollo-client";
import { File, Folder } from "../../lib/appInterfaces";

// create File (story)

const createFile = async (
  mainId: string,
  folderId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileData: any,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  try {
    return await client.mutate({
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
                description: fileData.discription || "",
                sprint: "",
              },
            },
          },
          folderHas: {
            connect: {
              where: {
                node: {
                  id: folderId,
                },
              },
            },
          },
          projectHas: {
            connect: {
              where: {
                node: {
                  id: mainId,
                },
              },
            },
          },
          hasFlowchart: {
            create: {
              node: {
                name: "flowchart",
              },
            },
          },
        },
      },
      update: (
        cache,
        {
          data: {
            createFiles: { files },
          },
        }
      ) => {
        const { projects } = cache.readQuery({
          query,
          variables: {
            where: {
              id: fileData.projectId,
            },
          },
        });
        const { hasContainsFile, hasContainsFolder, ...projectData } =
          projects[0];
        if (folderId) {
          const updateFileInFolder = hasContainsFolder.map((folder: Folder) => {
            if (folder.id === folderId) {
              return {
                ...folder,
                hasFile: [...folder.hasFile, ...files],
              };
            }
            return folder;
          });
          const updatedProject = {
            ...projectData,
            hasContainsFile,
            hasContainsFolder: updateFileInFolder,
          };
          cache.writeQuery({
            query,
            variables: {
              where: {
                id: fileData.projectId,
              },
            },
            data: {
              projects: [updatedProject],
            },
          });
        } else {
          const updatedFiles = [...hasContainsFile, ...files];
          const updatedProject = {
            ...projects[0],
            hasContainsFile: updatedFiles,
          };
          cache.writeQuery({
            query,
            variables: {
              where: {
                id: fileData.projectId,
              },
            },
            data: {
              projects: [updatedProject],
            },
          });
        }
      },
    });
  } catch (error) {
    console.log("Error in creating new file", error);
  }
};

async function getTreeNodeByUser(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string,
  setLoading: any
) {
  var nodes: Array<Project> = [];

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
      const mainData = result.data.projects;
      const data = mainData.map((value: any) => {
        const { hasContainsFile, hasContainsFolder, ...rest } = value;
        return { ...rest, children: hasContainsFolder };
      });
      const res_updated = transformObject(result);
      nodes = res_updated.data.projects;
      setLoading(result.loading);
    });
  return nodes;
}
async function deleteFileBackend(
  fileID: string,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  readAndWriteQueryId: string
) {
  try {
    return await client.mutate({
      mutation: deleteFiles,
      variables: {
        where: {
          id: fileID,
        },
        delete: {
          hasFlowchart: {
            delete: {
              hasNodes: [
                {
                  delete: {
                    hasdataNodedata: {
                      delete: {
                        hasLinkedTo: {},
                        hasLinkedBy: {},
                      },
                    },
                    haspositionPosition: {},
                  },
                },
              ],
              hasEdges: [
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
      update: (cache, { data }) => {
        const { projects } = cache.readQuery({
          query,
          variables: {
            where: {
              id: readAndWriteQueryId,
            },
          },
        });
        const { hasContainsFile, ...projectData } = projects[0];
        const to_be_update = hasContainsFile.filter(
          (file: File) => file.id !== fileID
        );
        const updatedProject = {
          ...projectData,
          hasContainsFile: to_be_update,
        };
        cache.writeQuery({
          query,
          variables: { where: { id: readAndWriteQueryId } },
          data: { projects: [updatedProject] },
        });
      },
    });
  } catch (error) {
    console.error("Error deleting the file", error);
  }
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
          hasFlowchart: {
            hasNodes_SINGLE: {
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
        hasComments: [
          {
            create: [
              {
                node: {
                  message: discussion,
                  userHas: {
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
  createFile,
};
