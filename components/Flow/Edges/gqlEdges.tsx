import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../../apollo-client";
import { Edge } from "reactflow";
import { Edge_Fragment } from "../Nodes/gqlNodes";

const allEdges = gql`
  ${Edge_Fragment}
  query getAllEdges($where: flowchartWhere) {
    flowcharts(where: $where) {
      name
      edges {
        ...EdgeFragment
      }
    }
  }
`;

// create Edge mutation

const createEdgeMutation = gql`
  ${Edge_Fragment}
  mutation UpdateFiles($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasflowchart {
          name
          edges {
            ...EdgeFragment
          }
        }
      }
    }
  }
`;

async function getEdges(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  id: string
) {
  var edges: Array<Edge> = [];

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
      const edges1 = JSON.stringify(result.data.flowcharts[0].edges);
      // @ts-ignore
      edges = JSON.parse(
        edges1.replaceAll('"hasedgedataEdgedata":', '"data":')
      );
    });
  return edges;
}

//methode for creating edge
const createFlowEdge = async (newEdge: any, id: string, updateEdges: any) => {
  var edges: Array<Edge> = [];
  await client
    .mutate({
      mutation: createEdgeMutation,
      variables: {
        where: {
          id,
        },
        update: {
          hasflowchart: {
            update: {
              node: {
                edges: [
                  {
                    create: [
                      {
                        node: {
                          name: "newEdge",
                          selected: true,
                          source: newEdge.source,
                          sourceHandle: newEdge.sourceHandle,
                          target: newEdge.target,
                          targetHandle: newEdge.targetHandle,
                          hasedgedataEdgedata: {
                            create: {
                              node: {
                                bidirectional: newEdge.data.bidirectional,
                                boxCSS: newEdge.data.boxCSS,
                                label: newEdge.data.label,
                                pathCSS: newEdge.data.pathCSS,
                              },
                            },
                          },
                          flownodeConnectedby: {
                            connect: {
                              where: {
                                node: {
                                  id: newEdge.source,
                                },
                              },
                            },
                          },
                          connectedtoFlownode: {
                            connect: {
                              where: {
                                node: {
                                  id: newEdge.target,
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
          },
        },
      },
    })
    .then((result) => {
      const edges1 = JSON.stringify(
        result.data.updateFiles.files[0].hasflowchart.edges
      );
      //@ts-ignore
      edges = JSON.parse(
        edges1.replaceAll('"hasedgedataEdgedata":', '"data":')
      );
      return updateEdges(edges);
    })
    .catch((error) => {
      console.error(error);
    });
};

//update Edge mutation

const updateEdgeMutation = gql`
  mutation updateEdge($where: flowEdgeWhere, $update: flowEdgeUpdateInput) {
    updateFlowEdges(where: $where, update: $update) {
      flowEdges {
        hasedgedataEdgedata {
          label
          bidirectional
          boxCSS
        }
      }
    }
  }
`;

// update edge method
const updateEdgeBackend = async (
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  edgeData: any
) => {
  await client.mutate({
    mutation: mutation,
    variables: {
      where: {
        id: edgeData.id,
      },
      update: {
        hasedgedataEdgedata: {
          update: {
            node: {
              label: edgeData.data.label,
              bidirectional: edgeData.data.bidirectional,
              boxCSS: edgeData.data.boxCSS,
              pathCSS: edgeData.data.pathCSS,
            },
          },
        },
      },
    },
  });
};

// delete Edge

const deleteEdgeMutation = gql`
  mutation deleteFlowEdges(
    $where: flowEdgeWhere
    $delete: flowEdgeDeleteInput
  ) {
    deleteFlowEdges(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

// delete edge method
const deleteEdgeBackend = async (edgeId: string, label: string) => {
  await client.mutate({
    mutation: deleteEdgeMutation,
    variables: {
      where: {
        id: edgeId,
      },
      delete: {
        hasedgedataEdgedata: {
          where: {
            node: {
              label,
            },
          },
        },
      },
    },
  });

  //await client.resetStore()
};

export {
  allEdges,
  getEdges,
  createFlowEdge,
  deleteEdgeBackend,
  updateEdgeBackend,
  updateEdgeMutation,
};
