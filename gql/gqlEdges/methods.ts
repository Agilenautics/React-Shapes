import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { Edge } from "reactflow";
import { createEdgeMutation, deleteEdgeMutation } from "./mutations";
import getEdgesMiddleWare from "../../components/Flow/getEdgesMiddleware";
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
  console.log("newEdge", newEdge);
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
      update: (
        cache,
        {
          data: {
            updateFlowEdges: { flowEdges },
          },
        }
      ) => {
        // const existanceData = cache.readQuery({
        //   query: cahchQuery,
        //   variables: {
        //     where: {
        //       hasFile: {
        //         id: selectedFileId,
        //       },
        //     },
        //   },
        // });
        // console.log(existanceData)
        // const {flowcharts} = existanceData
        // const { hasEdges, ...flowchartData } = flowcharts[0];
        // // const responseData = { ...flowEdges[0].hasedgedataEdgedata };
        // const updatedEdge = hasEdges.map((edge: Edge) => {
        //   if (edge.id === edgeData.id) {
        //     return {
        //       ...edge,
        //       hasedgedataEdgedata: {
        //         label: data.label,
        //         bidirectional: data.bidirectional,
        //         boxCSS: data.boxCSS,
        //       },
        //     };
        //   }
        //   return {
        //     ...edge,
        //   };
        // });
        // const updatedFlowChart = { ...flowchartData, hasEdges: updatedEdge };
        // console.log(updatedFlowChart);
        
        // cache.writeQuery({
        //   query: cahchQuery,
        //   variables: {
        //     where: {
        //       hasFile: {
        //         id: selectedFileId,
        //       },
        //     },
        //   },
        //   data: {
        //     flowcharts: [updatedFlowChart],
        //   },
        // });
      },
      refetchQueries:[{
        query:cahchQuery,
        variables:{
          where:{
            hasFile:{
              id:selectedFileId
            }
          }
        }
      }]
      
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
    update: (cache) => {
      const { files } = cache.readQuery({
        query: cacheQuery,
        variables: {
          where: {
            id: cacheQueryId,
          },
        },
      });
      // remove the deleted edge from the list
      const { hasNodes, ...fileData } = files[0];
      const allEdges = getEdgesMiddleWare(hasNodes);

      const updatedNodes = hasNodes.map(node => ({
        ...node,
        flowEdge: allEdges,
      }));
      // i want to store edge with respective node data
      console.log(updatedNodes)
      
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
