import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Edge } from "reactflow";
import { createEdgeMutation, deleteEdgeMutation } from "./mutations";

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
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  newEdge: Edge,
  id: string,
  cahchQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  try {
    return await client.mutate({
      mutation,
      variables: {
        input: [
          {
            name: "newEdge",
            selected: true,
            source: newEdge.source,
            sourceHandle: newEdge.sourceHandle,
            target: newEdge.target,
            targetHandle: newEdge.targetHandle,
            flowchartHas: {
              connect: {
                where: {
                  node: {
                    hasFile: {
                      id,
                    },
                  },
                },
              },
            },
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
        ],
      },
      update: (
        cache,
        {
          data: {
            createFlowEdges: { flowEdges },
          },
        }
      ) => {
        const { flowcharts } = cache.readQuery({
          query: cahchQuery,
          variables: {
            where: {
              hasFile: {
                id,
              },
            },
          },
        });
        const { hasEdges, ...flowchartData } = flowcharts[0];
        const updatedEdges = [...hasEdges, ...flowEdges];
        const to_be_update = { ...flowchartData, hasEdges: updatedEdges };
        cache.writeQuery({
          query: cahchQuery,
          variables: {
            where: {
              hasFile: {
                id,
              },
            },
          },
          data: {
            flowcharts: [{ ...to_be_update }],
          },
        });
      },
    });
  } catch (error) {
    console.error(error);
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
  try {
    return await client.mutate({
      mutation: mutation,
      variables: {
        where: {
          id: edgeData.id,
        },
        update: {
          hasedgedataEdgedata: {
            update: {
              node: {
                label: edgeData.label,
                bidirectional: edgeData.bidirectional,
                boxCSS: edgeData.boxCSS,
                pathCSS: edgeData.pathCSS,
              },
            },
          },
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
      //   console.log(selectedFileId);
      //   const { flowcharts } = cache.readQuery({
      //     query: cahchQuery,
      //     variables: {
      //       where: {
      //         hasFile: {
      //           id: selectedFileId,
      //         },
      //       },
      //     },
      //   });
      //   const { hasEdges, ...flowchartData } = flowcharts[0];
      //   const responseData = { ...flowEdges[0].hasedgedataEdgedata };
      //   const updatedEdge = hasEdges.map((edge: Edge) => {
      //     if (edge.id === edgeData.id) {
      //       return {
      //         ...edge,
      //         hasedgedataEdgedata: {
      //           label: responseData.label,
      //           bidirectional: responseData.bidirectional,
      //           boxCSS: responseData.boxCSS,
      //         },
      //       };
      //     }
      //     return {
      //       ...edge,
      //     };
      //   });
      //   const updatedFlowChart = { ...flowchartData, hasEdges: updatedEdge };
      //   console.log(updatedFlowChart);
      //   cache.writeQuery({
      //     query: cahchQuery,
      //     variables: {
      //       where: {
      //         hasFile: {
      //           id: selectedFileId,
      //         },
      //       },
      //     },
      //     data: {
      //       flowcharts: [updatedFlowChart],
      //     },
      //   });
      // },
    });
  } catch (error) {
    console.log(error, "while updating edge");
  }
};

// delete Edge

// delete edge method
const deleteEdgeBackend = async (
  edgeId: string,
  label: string,
  cahchQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  fileId: string
) => {
  try {
    await client.mutate({
      mutation: deleteEdgeMutation,
      variables: {
        where: {
          id: edgeId,
        },
        delete: {
          hasedgedataEdgedata: {},
        },
      },
      update: (cache, { data: { deleteFlowEdges } }) => {
        const { flowcharts } = cache.readQuery({
          query: cahchQuery,
          variables: {
            where: {
              hasFile: {
                id: fileId,
              },
            },
          },
        });
        const { hasEdges, ...flowchartsData } = flowcharts[0];
        const deleted_edge = hasEdges.filter(
          (edge: Edge) => edge.id !== edgeId
        );
        const updatedFlowchart = { ...flowchartsData, hasEdges: deleted_edge };
        cache.writeQuery({
          query: cahchQuery,
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
    console.log(error, "while deletin the edge");
  }
};

export {
  getEdges,
  createFlowEdge,
  deleteEdgeBackend,
  updateEdgeBackend,
};
