import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import { Project, transformObject } from "./interfaces";
import client from "../../apollo-client";
import { File, Folder } from "../../lib/appInterfaces";
import { MOVE_FILE } from "./MOVE_FILE";

// create File (story)

const createFile = async (
  mainId: string,
  folderId: string,
  email: string,
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
          createdBy: {
            connect: {
              where: {
                node: {
                  emailId: email,
                },
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
        const findParent = hasContainsFolder.find(
          (folder: Folder) => folder.id === folderId
        ) as Folder;
        if (findParent?.type === "folder") {
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
          hasNodes: [
            {
              delete: {
                flowEdge: [
                  {
                    delete: {},
                  },
                ],
                hasInfo: {},
              },
            },
          ],
          hasInfo: {},
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
        //getting folders or epics and file or story from the readQuery projects
        const { hasContainsFile, hasContainsFolder, ...projectData } =
          projects[0];
        // finding the parent of the file or story
        const findParent = hasContainsFolder.find(
          (folder: Folder) => folder.id === deleteIds.parentId
        ) as Folder;
        //checking if its folder then iam removing file inside the folder
        if (findParent?.type === "folder") {
          const { hasFile } = findParent;
          const newHasFile = hasFile.filter(
            (file: File) => file.id !== deleteIds.id
          );
          // updating removed data to the folder
          const updatedFolder = hasContainsFolder.map((folder: Folder) => {
            if (folder.id === deleteIds.parentId) {
              return {
                ...folder,
                hasFile: newHasFile,
              };
            }
            return {
              folder,
            };
          });
          // and finally updating the project
          const updatedProject = {
            ...projectData,
            hasContainsFile,
            hasContainsFolder: updatedFolder,
          };
          cache.writeQuery({
            query,
            variables: {
              where: {
                id: deleteIds.projectId,
              },
            },
            data: {
              projects: [updatedProject],
            },
          });
        } else {
          const to_be_update = hasContainsFile.filter(
            (file: File) => file.id !== deleteIds.id
          );

          const updatedProject = {
            ...projectData,
            hasContainsFile: to_be_update,
            hasContainsFolder,
          };
          cache.writeQuery({
            query,
            variables: { where: { id: deleteIds.projectId } },
            data: { projects: [updatedProject] },
          });
        }
      },
    });
  } catch (error) {
    console.error("Error deleting the file", error);
  }
}
// const connectToFolderBackendOnMove = async (folderId: any, fileId: string) => {
//   await client.mutate({
//     mutation: connectToFolderOnMove,
//     variables: {
//       where: {
//         id: folderId,
//       },
//       connect: {
//         hasFile: [
//           {
//             where: {
//               node: {
//                 id: fileId,
//               },
//             },
//           },
//         ],
//       },
//     },
//   });
// };
// const disconnectFromFolderBackendOnMove = async (fileId: string) => {
//   await client.mutate({
//     mutation: disconnectFromFolderOnMove,
//     variables: {
//       where: {
//         hasFile_SINGLE: {
//           id: fileId,
//         },
//       },
//       disconnect: {
//         hasFile: [
//           {
//             where: {
//               node: {
//                 id: fileId,
//               },
//             },
//           },
//         ],
//       },
//     },
//   });
// };
const moveFileBackend = async (targetId:any,fileId:string)=> {
  await client.mutate({
    mutation:MOVE_FILE,
    variables:{
      
        "where": {
          "id": fileId
        },
        "disconnect": {
          "folderHas": {
            "disconnect": {
              "hasFile": [
                {
                  "where": {
                    "node": {
                      "id": fileId
                    }
                  }
                }
              ]
            }
          },
          "projectHas": {
            "disconnect": {
              "hasContainsFile": [
                {
                  "where": {
                    "node": {
                      "id": fileId
                    }
                  }
                }
              ]
            }
          }
        },
        "connect": {
          "folderHas": {
            "where": {
              "node": {
                "id": targetId
              }
            }
          },
          "projectHas": {
            "where": {
              "node": {
                "id":targetId
              }
            }
          }
        }
      }
      
      });
      await client.clearStore();
}
const updateFileBackend = async (
  fileData: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id: fileData.id,
      },
      update: {
        name: fileData.name,
      },
    },
    // update: (
    //   cache,
    //   {
    //     data: {
    //       updateFiles: { files },
    //     },
    //   }
    // ) => {
    //   const { projects } = cache.readQuery({
    //     query,
    //     variables: {
    //       where: {
    //         id: fileData.projectId,
    //       },
    //     },
    //   });
    //   const { hasContainsFile, hasContainsFolder, ...projectsData } =
    //     projects[0];
    //   const updatedFile = hasContainsFile.map((file: File) => {
    //     if (file.id === fileData.id) {
    //       return {
    //         ...file,
    //         name: files[0].name,
    //       };
    //     }
    //     return file;
    //   });
    //   const updatedProject = {
    //     ...projectsData,
    //     hasContainsFile: updatedFile,
    //     hasContainsFolder,
    //   };
    //   cache.writeQuery({
    //     query,
    //     variables: {
    //       where: {
    //         id: fileData.projectId,
    //       },
    //     },
    //     data: {
    //       projects: [updatedProject],
    //     },
    //   });
    // },
  });
};
// const getFileByNode = async (
//   nodeId: string,
//   customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
// ) => {
//   let file: any;
//   await client
//     .query({
//       query: customQuery,
//       variables: {
//         where: {
//           hasFlowchart: {
//             hasNodes_SINGLE: {
//               id: nodeId,
//             },
//           },
//         },
//       },
//     })
//     .then((result) => {
//       file = result;
//     });
//   return file;
// };

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
        name,
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
                  createdBy: {
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
  moveFileBackend,
  // getFileByNode,
  getTreeNodeByUser,
  updateStoryMethod,
  createFile,
};
