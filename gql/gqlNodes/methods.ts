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
import {
  allNodes,
  updatePositionMutation,
  delNodeMutation,
  updateNodesMutation,
} from "./mutations";

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

async function createNode(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  updateNode: any,
  data: any,
  addRow: any
) {
  // const addRow = backlogStore(state=> state.addRow)
  var nodes: Array<Node> = [];
  try {
    await client
      .mutate({
        mutation: mutation,
        variables: {
          where: {
            id: data.story,
          },
          update: {
            hasflowchart: {
              update: {
                node: {
                  hasNodes: [
                    {
                      create: [
                        {
                          node: {
                            flowchart: "flowNode",
                            draggable: true,
                            type: data.type,
                            uid: data.uid,
                            hasComments: {
                              create: [
                                {
                                  node: {
                                    message: data.discussion,
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
                            hasInfo: {
                              create: {
                                node: {
                                  description: "",
                                  assignedTo: data.assignedTo,
                                  status: "To-Do",
                                  dueDate: "",
                                  sprint: "",
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
                            hasSprint: {
                              connect: [
                                {
                                  where: {
                                    node: {
                                      id: data.sprint,
                                    },
                                  },
                                },
                              ],
                            },
                            haspositionPosition: {
                              create: {
                                node: {
                                  name: "pos",
                                  x: 30,
                                  y: 50,
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
            },
          },
        },
        update: (
          cache: ApolloCache<any> | any,
          {
            data: {
              updateFiles: { files },
            },
          }
        ) => {
          console.log(data.story);
          const existanceCache = cache.readQuery({
            query: allNodes,
            variables: {
              where: {
                hasFile: {
                  id: data.story,
                },
              },
            },
          });

          console.log(existanceCache, "data");
          const nodes = existanceCache.flowcharts[0].hasNodes;
          console.log(files);

          // const updated_nodes =
        },
      })
      .then((result) => {
        const nodes1 = JSON.stringify(
          result.data.updateFiles.files[0].hasflowchart.hasNodes
        )
          .replaceAll('"hasdataNodedata":', '"data":')
          .replaceAll('"haspositionPosition":', '"position":');
        //@ts-ignore
        nodes = JSON.parse(nodes1);
        data.status = data.status || "To-Do";
        // data.uid = result.data.updateFiles.files[0].hasflowchart.nodes[0].uid
        data.parent = data.epic;
        data.id = result.data.id;
        data.hasSprint = result.data.hasSprint;
        data.uid = result.data.uid;
        addRow(data);
        // addRow(data)
        return updateNode(nodes);
      });
  } catch (error) {
    console.log(error, "while creating node");
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
        const existanceData = cache.readQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
        });
        const nodes = existanceData.flowcharts[0].hasNodes;
        let deleted_node = nodes.filter((values: Node) => values.id !== nodeID);
        const updaedFlowNodes = {
          ...existanceData.flowcharts[0],
          nodes: deleted_node,
        };
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
            flowcharts: [updaedFlowNodes],
          },
        });
        const existanceMain = cache.readQuery({
          query: mainQuery,
          variables: {
            where: {
              id: projectId,
            },
          },
        });
        console.log(existanceMain);
        // const root = new TreeModel().parse(existanceMain.mains)
        // console.log(root)
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
      update: (cache, { data: { updatePositions } }) => {
        console.log(fileId);
        const existanceData = cache.readQuery({
          query,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
        });
        console.log(existanceData, "");
      },
    });
  } catch (error) {
    console.log(error, "whiele updating positin of the node");
  }
};

const updateNodeBackend = async (nodeData: any) => {
  await client.mutate({
    mutation: updateNodesMutation,
    variables: {
      where: {
        id: nodeData.id,
      },
      update: {
        type: nodeData.type,
        draggable: true,
      },
    },
  });
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
        fileId: nodeData.data.linkedBy.fileId,
        flag: nodeData.data.linkedBy.flag,
        id: nodeData.data.linkedBy.id,
        label: nodeData.data.linkedBy.label,
      },
    },
  });
};

//updateNodes links and data

const updateNodeData = async (
  nodeData: any,
  mutations: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
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
  });
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
