import { gql } from "@apollo/client";

// create Edge mutation

export const createEdgeMutation = gql`
  mutation CreateFlowEdges($input: [FlowEdgeCreateInput!]!) {
    createFlowEdges(input: $input) {
      flowEdges {
        id
        label
        bidirectional
        boxCSS
        pathCSS
        selected
        createdBy {
          id
          emailId
        }

        flowNodeConnection {
          edges {
            handle
            node {
              id
            }
          }
        }
      }
    }
  }
`;

export const deleteEdgeMutation = gql`
  mutation DeleteFlowEdges($where: FlowEdgeWhere) {
    deleteFlowEdges(where: $where) {
      nodesDeleted
    }
  }
`;
export const updateEdgeMutation = gql`
  mutation UpdateFlowEdges(
    $where: FlowEdgeWhere
    $update: FlowEdgeUpdateInput
  ) {
    updateFlowEdges(where: $where, update: $update) {
      flowEdges {
        id
        bidirectional
        boxCSS
        label
        pathCSS
      }
    }
  }
`;
