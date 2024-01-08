import { gql } from "@apollo/client";

export const DELETE_NODE = gql`
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
