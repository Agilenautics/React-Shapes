import { gql } from "@apollo/client";

export const UPDATE_NODE_POSITION = gql`
  mutation UpdateNodePosition($where: FlowNodeWhere,$update: FlowNodeUpdateInput) {
    updateFlowNodes(where: $where,update: $update) {
      flowNodes {
        id
        x
        y
      }
    }
  }
`;
