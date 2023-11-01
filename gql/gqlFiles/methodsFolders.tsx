import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import { getProjectByUser, deleteFolders, updateFolders } from "./mutations";
import { Folder} from "./interfaces";
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
  newFolderData: Folder | any
) {
  var node: any;
  await client
    .mutate({
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
                  sprint: "",
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
            hasSprint: {
              connect: {
                where: {
                  node: {
                    id: "", // here you want to add sprint id take as a param
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
        console.log(cache);
        try {
          const existingData = cache.readQuery({
            query: getProjectByUser,
            variables: {
              emailId: "irfan123@gmail.com",
            },
          });
          console.log(existingData);
        } catch (error) {
          console.log(error, "while creating folder");
        }
      },
    })
    .then((result) => {
      node = result.data.createFolders.folders[0];
      // console.log(result.data.createFolders);
    })
    .catch((error) => {
      console.log("Error in creating folder", error);
    });
  return node;
}
async function deleteFolderBackend(folderID: string, deleteItem: any) {
  return client
    .mutate({
      mutation: deleteFolders,
      variables: {
        where: {
          id: folderID,
        },
        delete: {
          hasFile: [
            {
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
          ],
        },
      },
    })
    .then((res) => {
      if (res.data) {
        deleteItem(folderID);
      }
      if (res.errors) {
        return (
          res.errors && <div>{res.errors.map((values) => values.message)}</div>
        );
      }
    })
    .catch((error) => {
      console.log("error while deleting folder", error);
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
const updateEpic = async (
  id: string,
  epictData: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  const { status, description, assignedTo, dueDate} = epictData;
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
