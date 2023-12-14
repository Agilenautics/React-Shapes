import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Edge } from "reactflow";
import { createEdgeMutation, deleteEdgeMutation } from "./mutations";
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
  updateEdges: any
) => {
  console.log("newEdge",newEdge)
  var edges: Array<Edge> = [];
  await client
    .mutate({
      mutation: createEdgeMutation,
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
    })
    .then((result) => {
      // const edges1 = JSON.stringify(
      //   result.data.updateFiles.files[0].hasEdges
      // );
      // //@ts-ignore
      // edges = JSON.parse(
      //   edges1.replaceAll('"hasedgedataEdgedata":', '"data":')
      // );
      // return updateEdges(edges);
    })
    .catch((error) => {
      console.error(error);
    });
};

//update Edge mutation

// update edge method
const updateEdgeBackend = async (
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  edgeData: any
) => {
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
    });
  } catch (error) {
    console.log(error, "while updating edge");
  }
};

// delete Edge

// delete edge method
const deleteEdgeBackend = async (edgeId: string, label: string) => {
  await client.mutate({
    mutation: deleteEdgeMutation,
    variables: {
      where: {
        id: edgeId,
      },
      delete: {
        where: {
          node: {
            label,
          },
        },
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
