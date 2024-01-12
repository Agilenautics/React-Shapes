import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Edge } from "reactflow";

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
      const edges1 = JSON.stringify(result.data.flowcharts[0].hasEdges);
      // @ts-ignore
      edges = JSON.parse(
        edges1.replaceAll('"hasedgedataEdgedata":', '"data":')
      );
    });
  return edges;
}

//methode for creating edge
const createFlowEdge = async (
  newEdge: any,
  email: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  cacheQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) => {
  try {
    return await client.mutate({
      mutation,
      variables: {
        input: [
          {
            createdBy: {
              connect: {
                where: {
                  node: {
                    emailId: email,
                  },
                },
              },
            },
            flowNode: {
              connect: [
                {
                  where: {
                    node: {
                      id: newEdge.source,
                    },
                  },
                  edge: {
                    handle: newEdge.sourceHandle,
                  },
                },
                {
                  where: {
                    node: {
                      id: newEdge.target,
                    },
                  },
                  edge: {
                    handle: newEdge.targetHandle,
                  },
                },
              ],
            },
            bidirectional: newEdge.data.bidirectional,
            boxCSS: newEdge.data.boxCSS,
            label: newEdge.data.label,
            pathCSS: newEdge.data.pathCSS,
            selected: false,
          },
        ],
      },
      // update: (
      //   cache,
      //   {
      //     data: {
      //       createFlowEdges: { flowEdges },
      //     },
      //   }
      // ) => {
      //   const cacheId = cache.identify(flowEdges[0]);
      //   console.log(cacheId);
      // },
      refetchQueries: [
        {
          query: cacheQuery,
          variables: {
            where: {
              id: fileId,
            },
          },
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};

//update Edge mutation

// update edge method
const updateEdgeBackend = async (
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  edgeData: any,
  cahchQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  selectedFileId: string
) => {
  const { id, label, boxCSS, pathCSS, bidirectional } = edgeData;
  try {
    return await client.mutate({
      mutation: mutation,
      variables: {
        where: {
          id,
        },
        update: {
          label,
          bidirectional,
          boxCSS,
          pathCSS,
        },
      },
      // update: (
      //   cache,
      //   {
      //     data: {
      //       updateFlowEdges: { flowEdges },
      //     },
      //   }
      // ) => {
      //   const updatedFlowedgeData = flowEdges[0];
      //   cache.modify({
      //     id: cache.identify(flowEdges[0]),
      //     fields: {
      //       label: () => updatedFlowedgeData.label,
      //       bidirectional: () => updatedFlowedgeData.bidirectional,
      //       boxCSS: () => updatedFlowedgeData.boxCSS,
      //       pathCSS: () => updatedFlowedgeData.pathCSS,
      //     },
      //   });
      // },

      refetchQueries: [
        {
          query: cahchQuery,
          variables: {
            where: {
              id: selectedFileId,
            },
          },
        },
      ],
    });
  } catch (error) {
    console.log(error, "while updating edge");
  }
};

// delete Edge

// delete edge method
const deleteEdgeBackend = async (
  edgeId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  cacheQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  cacheQueryId: string
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id: edgeId,
      },
    },
    refetchQueries: [
      {
        query: cacheQuery,
        variables: {
          where: {
            id: cacheQueryId,
          },
        },
      },
    ],
  });

  //await client.resetStore()
};

export {
  // allEdges,
  getEdges,
  createFlowEdge,
  deleteEdgeBackend,
  updateEdgeBackend,
};
