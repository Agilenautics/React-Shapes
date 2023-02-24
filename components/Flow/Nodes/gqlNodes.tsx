import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../../apollo-client";
import { Node } from "react-flow-renderer";

const allNodes = gql`
  query Query($where: flowNodeWhere) {
    flowNodes(where: $where) {
      id
      timeStamp
      draggable
      flowchart
      type
      hasdataNodedata {
        shape
        description
        label
      }
      haspositionPosition {
        x
        y
      }
    }
  }
`;

const getNode = gql`
  query Query($where: flowNodeWhere) {
    flowNodes(where: $where) {
      id
      timeStamp
      draggable
      flowchart
      type
      hasdataNodedata {
        shape
        description
        label
      }
      haspositionPosition {
        x
        y
      }
    }
  }
`;

const newNode = gql`
  mutation CreateFlowNodes($input: [flowNodeCreateInput!]!) {
    createFlowNodes(input: $input) {
      flowNodes {
        draggable
        flowchart
        type
        hasdataNodedata {
          shape
          description
          label
        }
        haspositionPosition {
          x
          y
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
        .replaceAll('"haspositionPosition":', '"position":');
      // @ts-ignore
      nodes = JSON.parse(nodes2);
    });
  return nodes;
}

async function getNodes(
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  flowchart: string
) {
  var nodes: Array<Node> = [];

  await client
    .query({
      query: customQuery,
      variables: {
        where: { flowchart: flowchart },
      },
    })
    .then((result) => {
      const nodes1 = JSON.stringify(result.data.flowNodes);
      const nodes2 = nodes1
        .replaceAll('"hasdataNodedata":', '"data":')
        .replaceAll('"haspositionPosition":', '"position":');
      // @ts-ignore
      nodes = JSON.parse(nodes2);
    });
  return nodes;
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

const delNode = gql`
  mutation Mutation($where: flowNodeWhere) {
    deleteFlowNodes(where: $where) {
      nodesDeleted
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
    },
  });
}

export { allNodes, newNode, findNode, getNodes, createNode, deleteNodeBackend };
