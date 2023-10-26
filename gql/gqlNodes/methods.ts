import {
    DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Node } from "reactflow";
import { Edge } from "reactflow";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import {
  updatePositionMutation,
  delNode,
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
      const nodes1 = JSON.stringify(result.data.flowcharts[0].nodes);
      const edge1 = JSON.stringify(result.data.flowcharts[0].edges);
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
                nodes: [
                  {
                    create: [
                      {
                        node: {
                          flowchart: "flowNode",
                          draggable: true,
                          type: data.type,
                          uid: data.uid,
                          comments: {
                            create: [
                              {
                                node: {
                                  message: data.discussion,
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
                                links: {
                                  create: {
                                    node: {
                                      label: "",
                                      id: "",
                                      flag: false,
                                      fileId: "",
                                    },
                                  },
                                },
                                linkedBy: {
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
                                x: 200,
                                y: 200,
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
    })
    .then((result) => {
      const nodes1 = JSON.stringify(
        result.data.updateFiles.files[0].hasflowchart.nodes
      )
        .replaceAll('"hasdataNodedata":', '"data":')
        .replaceAll('"haspositionPosition":', '"position":');
      //@ts-ignore
      nodes = JSON.parse(nodes1);
      console.log(result);

      data.status = data.status || "To-Do";
      // data.uid = result.data.updateFiles.files[0].hasflowchart.nodes[0].uid
      data.parent = data.epic;
      data.id = result.data.id;
      addRow(data);

      // addRow(data)
      return updateNode(nodes);
    })
    .catch((error) => {
      console.error(error);
    });
  // client.clearStore();
}

async function deleteNodeBackend(nodeID: string) {
  await client.mutate({
    mutation: delNode,
    variables: {
      where: {
        id: nodeID,
      },
      delete: {
        hasdataNodedata: {
          delete: {
            links: {},
            linkedBy: {},
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
  });
}

// here iam parforming update node position methode

const updatePosition = async (node: any) => {
  await client.mutate({
    mutation: updatePositionMutation,
    variables: {
      update: {
        x: node.position.x,
        y: node.position.y,
      },
      where: {
        flownodeHasposition: {
          id: node.id,
        },
      },
    },
  });
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
        hasLinked: {
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
        links: {
          update: {
            node: {
              fileId: nodeData.data.links.fileId,
              flag: nodeData.data.links.flag,
              id: nodeData.data.links.id,
              label: nodeData.data.links.label,
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
        comments: [
          {
            create: [
              {
                node: {
                  message: data.discussion,
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
