import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../../apollo-client";
import { Node } from "react-flow-renderer";
import { Edge } from "reactflow";

export const Node_Fragment = gql`
  fragment NodeFragment on flowNode {
    id
    draggable
    flowchart
    type
    timeStamp
    hasdataNodedata {
      label
      shape
      description
      links {
        label
        id
        flag
        fileId
      }
      linkedBy {
        label
        id
        fileId
        flag
      }
    }
    haspositionPosition {
      name
      x
      y
    }
  }
`;
export const Edge_Fragment = gql`
  fragment EdgeFragment on flowEdge {
    id
    source
    target
    sourceHandle
    targetHandle
    selected
    hasedgedataEdgedata {
      label
      pathCSS
      boxCSS
      bidirectional
    }
    flownodeConnectedby {
      id
      flowchart
    }
    connectedtoFlownode {
      id
      flowchart
    }
  }
`;
const allNodes = gql`
  ${Node_Fragment}
  ${Edge_Fragment}
  query Query($where: flowchartWhere) {
    flowcharts(where: $where) {
      name
      nodes {
        ...NodeFragment
      }
      edges {
        ...EdgeFragment
      }
    }
  }
`;

const getNode = gql`
  ${Node_Fragment}
  query FlowNodes($where: flowNodeWhere) {
    flowNodes(where: $where) {
      ...NodeFragment
    }
  }
`;

const newNode = gql`
  ${Node_Fragment}
  mutation UpdateFiles($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasflowchart {
          name
          nodes {
            ...NodeFragment
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
      //const nodes3 = JSON.stringify(result.data.flowNodes.hasdataNodedata.linkedByAggregate);
      const nodes1 = JSON.stringify(result.data.flowNodes);
      console.log("getnode", nodes1);
      const nodes2 = nodes1
        .replaceAll('"hasdataNodedata":', '"data":')
        //.replaceAll('"links":','"link":');
        .replaceAll('"haspositionPosition":', '"position":');
      // @ts-ignore
      nodes = JSON.parse(nodes2);
      console.log(nodes);
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
  id: string,
  flowchart: string,

  updateNode: any
) {
  var nodes: Array<Node> = [];
  await client
    .mutate({
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
                                label: "New Node",
                                shape: "rectangle",
                                description: "",
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
      return updateNode(nodes);
    })
    .catch((error) => {
      console.error(error);
    });
  client.clearStore();
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

const updateNodesMutation = gql`
${Node_Fragment}
  mutation updateFlowNode($where: flowNodeWhere, $update: flowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        ...NodeFragment
      }
    }
  }
`;

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

const updateLinkedBy = gql`
  mutation UpdateLinkedBy($where: linkedWhere, $update: linkedUpdateInput) {
    updateLinkeds(where: $where, update: $update) {
      linkeds {
        fileId
        flag
        id
        label
      }
    }
  }
`;

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

const updateLinksMutation = gql`
  mutation updateLinks($where: nodeDataWhere, $update: nodeDataUpdateInput) {
    updateNodeData(where: $where, update: $update) {
      nodeData {
        label
        description
        shape
        links {
          label
          id
          fileId
          flag
        }
      }
    }
  }
`;

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

export {
  allNodes,
  newNode,
  findNode,
  getNodes,
  createNode,
  deleteNodeBackend,
  updatePosition,
  updateNodeBackend,
  getNode,
  updateLinkedByMethod,
  updateLinkedBy,
  updateLinksMutation,
  updateNodeData,
};
