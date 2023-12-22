import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
  ApolloCache,
} from "@apollo/client";
import client from "../../apollo-client";
import { Node } from "reactflow";
import { Edge } from "reactflow";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { allNodes } from "./queries";
import TreeModel from "tree-model-improved";
import { findById } from "../../components/TreeView/backend";
import getUpdatedCacheData from "../../components/Flow/middleWares/updatingNodeCache";
import { File, Project } from "../../lib/appInterfaces";

async function findNode(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string
) {
  try {
    return await client.query({
      query: customQuery,
      variables: {
        where: { id },
      },
    });
  } catch (error) {
    console.log(error, "whiele find node by id ");
  }
}

async function getNodes(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string
) {
  try {
    return await client.query({
      query: customQuery,
      variables: {
        where: {
          id: id,
        },
      },
    });
  } catch (error) {
    console.log(error, "while getting all edges");
  }
}

const checkUserDidComment = (message: string) => {
  let updateQuery;
  if (message) {
    return {
      create: [
        {
          node: {
            message: null,
            createdBy: {
              connect: {
                where: {
                  node: {
                    emailId: null,
                  },
                },
              },
            },
          },
        },
      ],
    };
  } else {
    return null;
  }
};
async function createNode(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  data: any,
  email: string,
  cacheQuey: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) {
  try {
    return await client.mutate({
      mutation,
      variables: {
        input: [
          {
            type: data.type,
            uid: data.uid,
            draggable: true,
            flowchart: "flowchart",
            label: "New Node",
            shape: data.symbol,
            x: 100,
            y: 100,
            createdBy: {
              connect: {
                where: {
                  node: {
                    emailId: email,
                  },
                },
              },
            },
            hasFile: {
              connect: {
                where: {
                  node: {
                    id: data.story,
                  },
                },
              },
            },
            hasInfo: {
              create: {
                node: {
                  status: "To-Do",
                  assignedTo: data.assignedTo,
                  description: "",
                  dueDate: "",
                },
              },
            },

            hasSprint: {
              connect: [
                {
                  where: {
                    node: {
                      id: "",
                    },
                  },
                },
              ],
            },
            // todo conditionally creating
            // hasComments: {
            //   create: [
            //     {
            //       node: {
            //         message: null,
            //         createdBy: {
            //           connect: {
            //             where: {
            //               node: {
            //                 emailId: email,
            //               },
            //             },
            //           },
            //         },
            //       },
            //     },
            //   ],
            // },
          },
        ],
      },
      update: (
        cache,
        {
          data: {
            createFlowNodes: { flowNodes },
          },
        }
      ) => {
        const { files } = cache.readQuery({
          query: cacheQuey,
          variables: {
            where: {
              id: fileId,
            },
          },
        });
        if (files && files.length) {
          const { hasNodes } = files[0];
          const updaedFlowchart = {
            ...files[0],
            hasNodes: [...hasNodes, ...flowNodes],
          };
          cache.writeQuery({
            query: allNodes,
            variables: {
              where: {
                id: data.story,
              },
            },
            data: {
              files: [updaedFlowchart],
            },
          });
        }
      },
    });
  } catch (error) {
    console.log(error, "error while creating the node");
  }
}
async function deleteNodeBackend(
  nodeID: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string,
  projectId: string,
  mainQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id: nodeID,
        },
      },
      update: (cache, { data }) => {
        const { files } = cache.readQuery({
          query,
          variables: {
            where: {
              id: fileId,
            },
          },
        });
        const { hasNodes, ...filedata } = files[0];
        const deleted_node = hasNodes.filter(
          (node: Node) => node.id !== nodeID
        );
        cache.writeQuery({
          query,
          variables: {
            where: {
              id: fileId,
            },
          },
          data: {
            files: [{ ...filedata, hasNodes: deleted_node }],
          },
        });
      },
    });
  } catch (error) {
    console.log(error, "while deleting the node..");
  }
}

// here iam parforming update node position methode

const updatePosition = async (
  node: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) => {
  const { position } = node;
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id: node.id,
        },
        update: {
          x: position.x,
          y: position.y,
        },
      },
      update: (
        cache,
        {
          data: {
            updateFlowNodes: { flowNodes },
          },
        }
      ) => {
        const { files } = cache.readQuery({
          query,
          variables: {
            where: {
              id: fileId,
            },
          },
        });

        const { hasNodes, ...FileData } = files[0];
        const { x, y, id } = flowNodes[0];
        const updatedNode = hasNodes.map((node: Node) => {
          if (node.id === id) {
            return {
              ...node,
              x,
              y,
            };
          }
          return {
            ...node,
          };
        });
        const updatedFile = { ...FileData, hasNodes: updatedNode };
        cache.writeQuery({
          query,
          variables: {
            where: {
              id: fileId,
            },
          },
          data: {
            files: [updatedFile],
          },
        });
      },
    });
  } catch (error) {
    console.log(error, "whiele updating positin of the node");
  }
};

const updateNodeBackend = async (
  nodeData: any,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) => {
  try {
    return await client.mutate({
      mutation,
      variables: {
        where: {
          id: nodeData.id,
        },
        update: {
          type: nodeData.type,
          draggable: true,
        },
      },
      // update: (
      //   cache,
      //   {
      //     data: {
      //       updateFlowNodes: { flowNodes },
      //     },
      //   }
      // ) => {
      //   const { flowcharts } = cache.readQuery({
      //     query,
      //     variables: {
      //       where: {
      //         hasFile: {
      //           id: fileId,
      //         },
      //       },
      //     },
      //   });
      //   const { hasNodes, ...flowchartData } = flowcharts[0];
      //   const updatedNode = hasNodes.map((node: Node) => {
      //     if (node.id === nodeData.id) {
      //       return {
      //         ...flowNodes,
      //       };
      //     }
      //     return {
      //       ...node,
      //     };
      //   });
      //   const updatedFlowchart = { ...flowchartData, hasNodes: updatedNode };
      //   cache.writeQuery({
      //     query,
      //     variables: {
      //       where: {
      //         hasFile: {
      //           id: fileId,
      //         },
      //       },
      //     },
      //     data: {
      //       flowcharts: [updatedFlowchart],
      //     },
      //   });
      // },
    });
  } catch (error) {
    console.log("Error while updating node", error);
  }
};

// const updateLinkedByMethod = async (
//   nodeData: any,
//   mutations: DocumentNode | TypedDocumentNode<any, OperationVariables>
// ) => {
//   await client.mutate({
//     mutation: mutations,
//     variables: {
//       where: {
//         hasLinkedBy: {
//           flownodeHasdata: {
//             id: nodeData.id,
//           },
//         },
//       },
//       update: {
//         fileId: nodeData.data.hasLinkedBy.fileId,
//         flag: nodeData.data.hasLinkedBy.flag,
//         id: nodeData.data.hasLinkedBy.id,
//         label: nodeData.data.hasLinkedBy.label,
//       },
//     },
//   });
// };

//updateNodes links and data

const updateNodeData = async (
  nodeData: any,
  mutations: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) => {
  const { id, data, type, hasInfo } = nodeData;
  try {
    return await client.mutate({
      mutation: mutations,
      variables: {
        where: {
          id,
        },
        update: {
          label: data.label,
          shape: data.shape,
          type: type,
          hasInfo: {
            update: {
              node: {
                assignedTo: hasInfo.assignedTo,
                description: data.description,
                dueDate: hasInfo.dueDate,
                status: hasInfo.status,
              },
            },
          },
        },
      },
      
    });
  } catch (error) {
    console.log(error, "updating node data");
  }
};

const updateTaskMethod = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  data: any
) => {
  // const updateRow = backlogStore(state => state.updateRow);
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
              status: data.status,
              description: data.description,

              dueDate: data.dueDate || null,
              assignedTo: data.assignedTo || null,
            },
          },
        },

        label: data.name,
        hasSprint: {
          connect: [
            {
              where: {
                node: {
                  id: data.sprint || "",
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
                  message: data.discussion,
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
    // update:(cache,data)=>{
    //   const existanceCatch = cache.readQuery({
    //     query:getMainByUser,
    //   });
    //   console.log(existanceCatch)

    // }
  });
  // const { mains } = client.readQuery({
  //   query: getMainByUser,
  //   variables:{
  //     emailId:"irfan123@gmail.com"
  //   }
  // });

  return response;
};
const linkNodeAnotherNodeMethod = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  anotherNodId:string
) => {
  try {
    return await client.mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        connect: {
          isLinked: {
            edge: {
              isLeft: false,
            },
            where: {
              node: {
                id: anotherNodId,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log("while linking a node",error)
  }
};
export {
  createNode,
  getNodes,
  findNode,
  deleteNodeBackend,
  updatePosition,
  updateNodeBackend,
  //updateLinkedByMethod,
  updateNodeData,
  updateTaskMethod,
  linkNodeAnotherNodeMethod
};
