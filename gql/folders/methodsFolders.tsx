import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import { Folder } from "../files/interfaces";
import client from "../../apollo-client";
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
// here adding epic and also to sprint
async function createFolderInMain(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  parentId: string,
  email: string,
  newFolderData: Folder | any,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) {
  try {
    return await client.mutate({
      mutation: mutation,
      variables: {
        input: [
          {
            type: "folder",
            isOpen: newFolderData.isOpen,
            name: newFolderData.name,
            uid: newFolderData.uid,
            hasInfo: {
              create: {
                node: {
                  status: "To-Do",
                  assignedTo: "",
                  dueDate: "",
                  description: "",
                },
              },
            },
            projectHas: {
              connect: {
                where: {
                  node: {
                    id: parentId,
                  },
                },
              },
            },
            createdBy: {
              connect: {
                where: {
                  node: {
                    emailId: email,
                  },
                },
              },
            },
            hasSprint: {
              connect: {
                where: {
                  node: {
                    id: newFolderData.sprintId, // here you want to add sprint id take as a param
                  },
                },
              },
            },
          },
        ],
      },
      update: (
        cache,
        {
          data: {
            createFolders: { folders },
          },
        }
      ) => {
        const { projects } = cache.readQuery({
          query,
          variables: {
            where: {
              id: parentId,
            },
          },
        });
        const { hasContainsFolder, ...projectData } = projects[0];
        const updatedProjects = [...hasContainsFolder, ...folders];
        const updatedProject = {
          ...projectData,
          hasContainsFolder: updatedProjects,
        };
        cache.writeQuery({
          query,
          variables: {
            where: {
              id: parentId,
            },
          },
          data: {
            projects: [updatedProject],
          },
        });
      },
    });
  } catch (error) {
    console.log(error, "error while creating folder");
  }
}
async function deleteFolderBackend(
  deleteIds: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) {
  try {
    return await client.mutate({
      mutation,
      variables: {
        where: {
          id: deleteIds.id,
        },
        delete: {
          hasFile: [
            {
              delete: {
                hasInfo: {},
                hasNodes: [
                  {
                    delete: {
                      hasInfo: {},
                      flowEdge: [
                        {
                          delete: {},
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
          hasInfo: {},
          hasFolder: [
            {
              delete: {
                hasFile: [
                  {
                    delete: {
                      hasInfo: {},
                      hasNodes: [
                        {
                          delete: {
                            hasInfo: {},
                            flowEdge: [
                              {
                                delete: {},
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
                hasInfo: {},
              },
            },
          ],
        },
      },
      update: (cache, { data }) => {
        const { projects } = cache.readQuery({
          query,
          variables: {
            where: {
              id: deleteIds.projectId,
            },
          },
        });
        const { hasContainsFolder, ...projectData } = projects[0];
        const to_be_updated = hasContainsFolder.filter(
          (folder: Folder) => folder.id !== deleteIds.id
        );
        const updatedProject = {
          ...projectData,
          hasContainsFolder: to_be_updated,
        };
        cache.writeQuery({
          query,
          variables: { where: { id: deleteIds.projectId } },
          data: { projects: [{ ...updatedProject }] },
        });
      },
    });
  } catch (error) {
    console.log("error while deleting folder", error);
  }
}
const updateFolderBackend = async (
  folderData: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  try {
    return await client.mutate({
      mutation,
      variables: {
        where: {
          id: folderData.id,
        },
        update: {
          name: folderData.name,
        },
      },
      update: (cache, { data }) => {
        const { projects } = cache.readQuery({
          query,
          variables: {
            where: {
              id: folderData.projectId,
            },
          },
        });
        const { hasContainsFolder, ...projectData } = projects[0];
        const updatedFolder = hasContainsFolder.map((folder: Folder) => {
          if (folder.id === folderData.id) {
            return {
              ...folder,
              name: folderData.name,
            };
          }
          return folder;
        });
        const updatedProject = {
          ...projectData,
          hasContainsFolder: updatedFolder,
        };
        cache.writeQuery({
          query,
          variables: {
            where: {
              id: folderData.projectId,
            },
          },
          data: {
            projects: [updatedProject],
          },
        });
      },
    });
  } catch (error) {
    console.log(error, "while updating the folder");
  }
};
const updateEpic = async (
  id: string,
  epictData: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  const { status, description, assignedTo, dueDate } = epictData;
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
export {
  createFolderInMain,
  createFolderInFolder,
  updateFolderBackend,
  updateEpic,
  deleteFolderBackend,
};
