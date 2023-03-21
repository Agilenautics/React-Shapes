import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../../apollo-client";
import { Edge } from "react-flow-renderer";

const allEdges = gql`
  query Query($where: flowEdgeWhere) {
    flowEdges(where: $where) {
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
  }
`;

// create Edge mutation

const createEdgeMutation = gql`
mutation CreateFlowEdges($input: [flowEdgeCreateInput!]!) {
  createFlowEdges(input: $input) {
     flowEdges {
      selected
      source
      sourceHandle
      target
      targetHandle
       hasedgedataEdgedata {
        id
        bidirectional
        boxCSS
        label
        pathCSS
      }
        flownodeConnectedby {
          flowchart
          id
        }
      connectedtoFlownode {
        flowchart
        id
      }
    }
  }
}
`

// delete Edge 

const deleteEdgeMutation = gql`
mutation deleteFlowEdges($where: flowEdgeWhere, $delete: flowEdgeDeleteInput) {
  deleteFlowEdges(where: $where, delete: $delete) {
    nodesDeleted
    relationshipsDeleted
  }
}
`


// delete edge method
const deleteEdge = async (edgeId: string, label: string) => {
  await client.mutate({
    mutation: deleteEdgeMutation,
    variables: {
      "where": {
        "id": edgeId
      },
      delete: {
        hasedgedataEdgedata: {
          where: {
            node: {
              label
            }
          }

        }


      }

    }
  })

  await client.resetStore()

}





async function getEdges(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  flowchart: string
) {
  var edges: Array<Edge> = [];

  await client
    .query({
      query: customQuery,
      variables: {
        where: {
          flownodeConnectedby: {
            flowchart: flowchart,
          },
        },
      },
    })
    .then((result) => {
      const edges1 = JSON.stringify(result.data.flowEdges);
      const edges2 = edges1.replaceAll('"hasedgedataEdgedata":', '"data":');
      // @ts-ignore
      edges = JSON.parse(edges2);
      // edges.forEach((edge) => {
      //   edge.source = edge.flownodeConnectedby.id;
      //   delete edge.flownodeCo
      //   edge.target = edge.connectedtoFlownode.id;
      // });
    });
  return edges;
}




//methode for creating edge
const createFlowEdge = async (newEdge: any, flowchart: string, updateEdges: any) => {
  await client.mutate({
    mutation: createEdgeMutation,
    variables: {
      input: {
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
              pathCSS: newEdge.data.pathCSS
            }
          }
        },
        flownodeConnectedby: {
          connect: {
            where: {
              node: {
                id: newEdge.source,
                flowchart: flowchart
              }
            }
          }
        },
        connectedtoFlownode: {
          connect: {
            where: {
              node: {
                id: newEdge.target,
                flowchart: flowchart
              }
            }
          }
        }
      }
    },
  })
  if (flowchart) {
    client.resetStore().then(() => {
      console.log('Cache reset successfully.');
      getEdges(allEdges, flowchart).then((res: any) => {
        return updateEdges(res)
      })
    }).catch((error) => {
      console.error(error);
    });
  }

}

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
`

// update edge method
const updateEdgeBackend = async (
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  edgeData: any
) => {
  await client.mutate({
    mutation: mutation,
    variables: {
      "where": {
        "id": edgeData.id
      },
      "update": {
        "hasedgedataEdgedata": {
          "update": {
            "node": {
              "label": edgeData.data.label,
              "bidirectional": edgeData.data.bidirectional,
              "boxCSS": edgeData.data.boxCSS,
              "pathCSS": edgeData.data.pathCSS
            }
          }
        }
      }
    }
  })
}

export { allEdges, getEdges, createFlowEdge, deleteEdge, updateEdgeBackend, updateEdgeMutation }
