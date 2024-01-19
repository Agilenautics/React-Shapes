import { gql } from "@apollo/client";

export const UPDATE_NODE = gql`
  mutation UpdateFlowNodes($where: FlowNodeWhere,$update: FlowNodeUpdateInput) {
    updateFlowNodes(where: $where,update: $update) {
      flowNodes {
        shape
        label
       
        nodeColor
        hasInfo {
          description
        }
      }
    }
  }
`;
