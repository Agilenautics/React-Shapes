import {
  gql,
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../../apollo-client";
import { Node, updateEdge } from "react-flow-renderer";
import { allEdges, getEdges } from "../Edges/gqlEdges";

const allNodes = gql`
  query getAllNodes($where: flowNodeWhere) {
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
          name
          x
          y
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
      x
      y
      flownodeHasposition {
        id
      }
    }
    
  }
}
`




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
  flowchart: string,
  updateNode: any,
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
                name: "position",
                x: 100,
                y: -150,
              },
            },
          },
        },
      ],
    },
  });


  if (flowchart) {
    client.resetStore().then(() => {
      getNodes(allNodes, flowchart).then((res) => {
        return updateNode(res)
      })
    }).catch((error) => {
      console.error(error);
    });
  }


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
  client.resetStore().then((res) => {
    console.log("cache restoring.......")
  }).catch((error) => {
    console.log(error)
  })
}

// here iam parforming update node position methode

const updatePosition = async (node: any) => {
  await client.mutate({
    mutation: updatePositionMutation,
    variables: {
      update: {
        x: node.position.x,
        y: node.position.y
      },
      where: {
        flownodeHasposition: {
          id: node.id
        }
      }
    }
  })
  await client.resetStore()
}
export { allNodes, newNode, findNode, getNodes, createNode, deleteNodeBackend, updatePosition };
