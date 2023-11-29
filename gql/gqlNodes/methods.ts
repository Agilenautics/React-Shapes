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
import { updateNodesMutation } from "./mutations";
import { allNodes } from "./queries";

async function findNode(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string
) {
  var nodes: Array<Node> = [];

  await client
    .query({
      query: customQuery,
      variables: {
        where: { id: id },
      },
    })
    .then((result) => {
      const nodes1 = JSON.stringify(result.data.flowNodes);
      const nodes2 = nodes1
        .replaceAll('"hasdataNodedata":', '"data":')
        .replaceAll('"haspositionPosition":', '"position":');
      // @ts-ignore
      nodes = JSON.parse(nodes2);
    });

  return nodes;
}

async function getNodes(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string
) {
  var nodes: Array<Node> = [];
  var edges: Array<Edge> = [];
  await client
    .query({
      query: customQuery,
      variables: {
        where: {
          hasFile: {
            id: id,
          },
        },
      },
    })
    .then((result) => {
      const nodes1 = JSON.stringify(result.data.flowcharts[0].hasNodes);
      const edge1 = JSON.stringify(result.data.flowcharts[0].hasEdges);
      const edge2 = edge1.replaceAll('"hasedgedataEdgedata":', '"data":');
      edges = JSON.parse(edge2);
      const nodes2 = nodes1
        .replaceAll('"hasdataNodedata":', '"data":')
        .replaceAll('"haspositionPosition":', '"position":');
      //@ts-ignore
      nodes = JSON.parse(nodes2);
    });

  return { nodes, edges };
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
  updateNode: any,
  data: any,
  email: string,
  addRow: any
) {
  // const addRow = backlogStore(state=> state.addRow)
  console.log("email",email)
  var nodes: Array<Node> = [];

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
            createdBy: {
              connect: {
                where: {
                  node: {
                    emailId: email,
                  },
                },
              },
            },
            flowchartHas: {
              connect: {
                where: {
                  node: {
                    hasFile: {
                      id: data.story,
                    },
                  },
                },
              },
            },

            hasdataNodedata: {
              create: {
                node: {
                  label: data.name || data.label,
                  shape: data.symbol || "rectangle",
                  description: data.description,
                  hasLinkedTo: {
                    create: {
                      node: {
                        label: "",
                        id: "",
                        flag: false,
                        fileId: "",
                      },
                    },
                  },
                  hasLinkedBy: {
                    create: {
                      node: {
                        label: "",
                        id: "",
                        fileId: "",
                        flag: false,
                      },
                    },
                  },
                },
              },
            },

            haspositionPosition: {
              create: {
                node: {
                  x: -50,
                  y: 50,
                  name: "Position",
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
        const { flowcharts } = cache.readQuery({
          query: allNodes,
          variables: {
            where: {
              hasFile: {
                id: data.story,
              },
            },
          },
        }) as any;
        const { hasNodes } = flowcharts[0];
        const updaedFlowchart = {
          ...flowcharts[0],
          hasNodes: [...hasNodes, ...flowNodes],
        };
        cache.writeQuery({
          query: allNodes,
          variables: {
            where: {
              hasFile: {
                id: data.story,
              },
            },
          },
          data: {
            flowcharts: [updaedFlowchart],
          },
        });
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
          hasdataNodedata: {
            delete: {
              hasLinkedTo: {},
              hasLinkedBy: {},
            },
          },
          haspositionPosition: {},
          connectedbyFlowedge: {
            delete: {
              hasedgedataEdgedata: {},
            },
          },
          flowedgeConnectedto: {
            delete: {
              hasedgedataEdgedata: {},
            },
          },
        },
      },
      update: (cache, { data }) => {
        const { flowcharts } = cache.readQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
        });

        const { hasNodes } = flowcharts[0];
        const deleted_node = hasNodes.filter(
          (node: Node) => node.id !== nodeID
        );
        const updatedFlowcharts = { ...flowcharts[0], hasNodes: deleted_node };

        cache.writeQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
          data: {
            flowcharts: [updatedFlowcharts],
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
  try {
    await client.mutate({
      mutation,
      variables: {
        where: {
          flownodeHasposition: {
            id: node.id,
          },
        },
        update: {
          x: node.position.x,
          y: node.position.y,
        },
      },
      update: (
        cache,
        {
          data: {
            updatePositions: { positions },
          },
        }
      ) => {
        const { flowcharts } = cache.readQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
        });
        const { hasNodes, ...flowchartsData } = flowcharts[0];
        const updatedNode = hasNodes.map((nodeData: Node) => {
          if (nodeData.id === node.id) {
            return {
              ...nodeData,
              haspositionPosition: positions[0],
            };
          }
          return {
            ...nodeData,
          };
        });
        const updatedFlowchart = { ...flowchartsData, hasNodes: updatedNode };
        cache.writeQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
          data: {
            flowcharts: [updatedFlowchart],
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
      update: (
        cache,
        {
          data: {
            updateFlowNodes: { flowNodes },
          },
        }
      ) => {
        const { flowcharts } = cache.readQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
        });
        const { hasNodes, ...flowchartData } = flowcharts[0];
        const updatedNode = hasNodes.map((node: Node) => {
          if (node.id === nodeData.id) {
            return {
              ...flowNodes,
            };
          }
          return {
            ...node,
          };
        });
        const updatedFlowchart = { ...flowchartData, hasNodes: updatedNode };
        cache.writeQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
          data: {
            flowcharts: [updatedFlowchart],
          },
        });
      },
    });
  } catch (error) {
    console.log("Error while updating node", error);
  }
};

const updateLinkedByMethod = async (
  nodeData: any,
  mutations: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation: mutations,
    variables: {
      where: {
        hasLinkedBy: {
          flownodeHasdata: {
            id: nodeData.id,
          },
        },
      },
      update: {
        fileId: nodeData.data.hasLinkedBy.fileId,
        flag: nodeData.data.hasLinkedBy.flag,
        id: nodeData.data.hasLinkedBy.id,
        label: nodeData.data.hasLinkedBy.label,
      },
    },
  });
};

//updateNodes links and data

const updateNodeData = async (
  nodeData: any,
  mutations: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) => {
  try {
    return await client.mutate({
      mutation: mutations,
      variables: {
        where: {
          flownodeHasdata: {
            id: nodeData.id,
          },
        },
        update: {
          description: nodeData.data.description,
          shape: nodeData.data.shape,
          label: nodeData.data.label,
          hasLinkedTo: {
            update: {
              node: {
                fileId: nodeData.data.hasLinkedTo.fileId,
                flag: nodeData.data.hasLinkedTo.flag,
                id: nodeData.data.hasLinkedTo.id,
                label: nodeData.data.hasLinkedTo.label,
              },
            },
          },
        },
      },
      update: (cache, { data: { updateNodeData } }) => {
        const { flowcharts } = cache.readQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
        });
        const { hasNodes, ...flowchartData } = flowcharts[0];
        const getNode = hasNodes.find((node: Node) => node.id === nodeData.id);
        const { hasdataNodedata } = getNode;
        const { hasLinkedBy } = hasdataNodedata;
        const { hasLinkedTo, ...hasNodeData } = updateNodeData.nodeData[0];
        const updatedHasNodeData = { ...hasNodeData, hasLinkedBy, hasLinkedTo };

        const updatedNode = hasNodes.map((node: Node) => {
          if (node.id === nodeData.id) {
            return {
              ...node,
              hasdataNodedata: {
                ...updatedHasNodeData,
              },
            };
          }
          return {
            ...node,
          };
        });
        const updatedFlowChart = { ...flowchartData, hasNodes: updatedNode };
        cache.writeQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
          data: {
            flowcharts: [updatedFlowChart],
          },
        });
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
              sprint: data.sprint || null,
              dueDate: data.dueDate || null,
              assignedTo: data.assignedTo || null,
            },
          },
        },

        hasdataNodedata: {
          update: {
            node: {
              label: data.name,
              description: data.description,
            },
          },
        },
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

export {
  createNode,
  getNodes,
  findNode,
  deleteNodeBackend,
  updatePosition,
  updateNodeBackend,
  updateLinkedByMethod,
  updateNodeData,
  updateTaskMethod,
};
