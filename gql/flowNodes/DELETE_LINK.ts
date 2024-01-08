import { gql } from "@apollo/client";

export const DELETE_LINK = gql`
  mutation UpdateFlowNodes(
    $where: FlowNodeWhere
    $disconnect: FlowNodeDisconnectInput
  ) {
    updateFlowNodes(where: $where, disconnect: $disconnect) {
      flowNodes {
        id
        label
        isLinked {
          label
        }
      }
    }
  }
`;
