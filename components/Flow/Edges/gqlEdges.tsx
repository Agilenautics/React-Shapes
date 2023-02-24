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
      console.log(edges);
    });
  return edges;
}

async function createNode(
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  flowchart: string
) {
  await client.mutate({
    mutation: mutation,
    variables: {
      input: [
        {
          draggable: true,
          flowchart: flowchart,
          type: "blueNode",
          hasdataNodedata: {
            create: {
              node: {
                label: "New Node",
                shape: "rectangle",
                description: "",
              },
            },
          },
          haspositionPosition: {
            create: {
              node: {
                x: 100,
                y: -150,
              },
            },
          },
        },
      ],
    },
  });
}

export { allEdges, getEdges, createNode };
