import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../../apollo-client";
import { Node, updateEdge } from "react-flow-renderer";
import { allEdges, getEdges } from "../Edges/gqlEdges";

const allNodes = gql`
  query Query($where: flowchartWhere) {
    flowcharts(where: $where) {
      name
      nodes {
        id
        draggable
        flowchart
        type
        timeStamp
        hasdataNodedata {
          label
          shape
          description
          links{
            label
            id
            flag
          }
        }
        haspositionPosition {
          x
          y
        }
      }
    }
  }
`;

const getNode = gql`
  query Query($where: fileWhere) {
    flowNodes {
      id
      timeStamp
      draggable
      flowchart
      type
      hasdataNodedata {
        shape
        description
        label
        links{
          id
          label
          flag
        }
      }
      haspositionPosition {
        x
        y
      }
    }
  }
`;

const newNode = gql`
  mutation UpdateFiles($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasflowchart {
          name
          nodes {
            draggable
            flowchart
            hasdataNodedata {
              label
              shape
              links{
                label
                id
                flag
              }
            }
            haspositionPosition {
              x
              y
            }
          }
        }
      }
    }
  }
`;

//updete position mutation

const updatePositionMutation = gql`
  mutation updatePosition($update: positionUpdateInput, $where: positionWhere) {
    updatePositions(update: $update, where: $where) {
      positions {
        name
        x
        y
        flownodeHasposition {
          id
        }
      }
    }
  }
`;

async function findNode(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  flowchart: string,
  id: string
) {
  var nodes: Array<Node> = [];

  await client
    .query({
      query: customQuery,
      variables: {
        where: { id: id, flowchart: flowchart },
      },
    })
    .then((result) => {
      const nodes1 = JSON.stringify(result.data.flowNodes);
      const nodes2 = nodes1
        .replaceAll('"hasdataNodedata":', '"data":')
        //.replaceAll('"links":','"link":');
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
      //console.log(result.data.flowcharts[0]);
      const nodes1 = JSON.stringify(result.data.flowcharts[0].nodes);

      const nodes2 = nodes1
        .replaceAll('"hasdataNodedata":', '"data":')
        
        .replaceAll('"haspositionPosition":', '"position":');
      //@ts-ignore
      nodes = JSON.parse(nodes2);
      //console.log("getNodes",nodes);
    });

  return nodes;
}

async function createNode(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string,
  flowchart: string,

  updateNode: any
) {
  await client.mutate({
    mutation: mutation,
    variables: {
      where: {
        id,
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
                        type: "blueNode",
                        hasdataNodedata: {
                          create: {
                            node: {
                              label: flowchart,
                              shape: "rectangle",
                              description:"",
                              links:{
                                create:{
                                  node:{
                                    label:"",
                                    id:"",
                                    flag:false,
                                  },
                                },
                              },
                            },
                          },
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
  });

  if (flowchart) {
    client
      .resetStore()
      .then(() => {
        getNodes(allNodes, id).then((res) => {
          return updateNode(res);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

const delNode = gql`
  mutation deleteNode($where: flowNodeWhere, $delete: flowNodeDeleteInput) {
    deleteFlowNodes(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

async function deleteNodeBackend(nodeID: string) {
  await client.mutate({
    mutation: delNode,
    variables: {
      where: {
        id: nodeID,
      },
      delete: {
        hasdataNodedata: {
          delete:{
          links:{}
          }
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
  // client
  // .resetStore()
  // .then((res) => {
  //   console.log("cache restoring.......");
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
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
  //await client.resetStore();
};

const updateNodesMutation = gql`
  mutation updateFlowNode($where: flowNodeWhere, $update: flowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        draggable
        type
        hasdataNodedata {
          label
          shape
          description
          links{
            label
            id
            flag
          }
        }
      }
    }
  }
`;

const updateNodeBackend = async (nodeData: any, flowchart: string) => {
  await client.mutate({
    mutation: updateNodesMutation,
    variables: {
      where: {
        id: nodeData.id,
      },
      update: {
        type: nodeData.type,
        draggable: true,
        hasdataNodedata: {
          update: {
            node: {
              label: nodeData.data.label,
              shape: nodeData.data.shape,
              description: nodeData.data.description,
              // links:{
              //  label:
              // }
            },
          },
        },
      },
    },
  });
};

export {
  allNodes,
  newNode,
  findNode,
  getNodes,
  createNode,
  deleteNodeBackend,
  updatePosition,
  updateNodeBackend,
};
