import { gql } from "@apollo/client";
import { Edge_Fragment } from "./fragments";

// create Edge mutation

export const createEdgeMutation = gql`
  ${Edge_Fragment}
  mutation CreateFlowEdges($input: [FlowEdgeCreateInput!]!) {
    createFlowEdges(input: $input) {
      flowEdges {
        ...EdgeFragment
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
  mutation updateEdge($where: FlowEdgeWhere, $update: FlowEdgeUpdateInput) {
    updateFlowEdges(where: $where, update: $update) {
      flowEdges {
        label
        bidirectional
        boxCSS
      }
    }
  }
`;
