import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Edge } from "reactflow";
import { createEdgeMutation, deleteEdgeMutation } from "./mutations";
import getEdgesMiddleWare from "../../components/Flow/middleWares/getEdgesMiddleware";
//import { allEdges } from "./queries";

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
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
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
  const { data } = edgeData;
  try {
    return await client.mutate({
      mutation: mutation,
      variables: {
        where: {
          id: edgeData.id,
        },
        update: {
          label: edgeData.data.label,
          bidirectional: edgeData.data.bidirectional,
          boxCSS: edgeData.data.boxCSS,
          pathCSS: edgeData.data.pathCSS,
        },
      },

      refetchQueries: [
        {
          query: cahchQuery,
          variables: {
            where: {
              hasFile: {
                id: selectedFileId,
              },
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
