import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Node } from "reactflow";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { GET_NODES } from "./GET_NODES";

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
           
            uid: data.uid,
            draggable: true,
            flowchart: "flowchart",
            label: "New Node",
            shape: data.symbol,
            x: 0,
            y: 100,
            nodeColor: "#6667AB",
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
        const updatedFlowNode = {
          ...flowNodes[0],
          flowEdge: [],
          isLinked: [],
        };
        if (files && files.length) {
          const { hasNodes } = files[0];

          const updaedFlowchart = {
            ...files[0],
            hasNodes: [...hasNodes, updatedFlowNode],
          };
          cache.writeQuery({
            query: GET_NODES,
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
        delete: {
          flowEdge: [
            {
              delete: {},
            },
          ],
          hasInfo: {},
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

//updateNodes links and data
const updateNodeData = async (
  nodeData: any,
  mutations: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) => {
  const { id, label, shape, nodeColor, description } = nodeData;
  try {
    return await client.mutate({
      mutation: mutations,
      variables: {
        where: {
          id,
        },
        update: {
          label,
          shape,
          nodeColor,
          hasInfo: {
            update: {
              node: {
                description,
              },
            },
          },
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
        const { hasNodes, ...fileData } = files[0];
        const updatedNode = hasNodes.map((node: Node) => {
          if (node.id === id) {
            return {
              ...node,
              shape: flowNodes[0].shape,
              nodeColor: flowNodes[0].nodeColor,
              label: flowNodes[0].label,
              hasInfo: {
                ...node.hasInfo,
                description,
              },
            };
          }
          return {
            ...node
          }
        });
        cache.writeQuery(
          {
            query,
            variables:{
              where:{
                id:fileId
              }
            },
            data:{
              files:[
                {
                  ...fileData,hasNodes:updatedNode
                }
              ]
            }
          }
        )
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
  anotherNodId: string,
  cacheQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
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
              from: id,
            },
            where: {
              node: {
                id: anotherNodId,
              },
            },
          },
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
        // const { files } = cache.readQuery({
        //   query: cacheQuery,
        //   variables: {
        //     where: {
        //       id: fileId,
        //     },
        //   },
        // });
        // const { hasNodes, ...fileData } = files[0];
        // const updatedNodes = hasNodes.map((node:Node)=>{
        //   console.log(node)
        //   if(node.id === id){
        //     return{
        //       ...node,
        //     }
        //   }
        // })
        // const getId: string | undefined = cache.identify(flowNodes[0]);
        // cache.modify({
        //   id: getId,
        //   fields: {
        //     FlowNode(existingData, { readField }) {
        //       const existanceNode = existingData.isLinked.some((value: Node) =>
        //         readField("id", value)
        //       );
        //       if (existanceNode) {
        //         return existingData;
        //       }
        //       return [...existingData.isLinked, ...flowNodes];
        //     },
        //   },
        // });
        // console.log('Modified Data:', modifiedData); // Add this line
      },
    });
  } catch (error) {
    console.log("while linking a node", error);
  }
};

const deleteLinkedNodeMethod = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  nodeId: string
) => {
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        disconnect: {
          isLinked: [
            {
              where: {
                node: {
                  id: nodeId,
                },
              },
            },
          ],
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
        const cacheId: string | undefined = cache.identify(flowNodes[0]);
        cache.modify({
          id: cacheId,
          fields: {
            FlowNode: (existanceData, { readField }) => {
              return existanceData.isLinked.filter(
                (values: any) => nodeId !== readField("id", values)
              );
            },
          },
        });
      },
    });
  } catch (error) {
    console.log(error);
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
  linkNodeAnotherNodeMethod,
  deleteLinkedNodeMethod,
};
