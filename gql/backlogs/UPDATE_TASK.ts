import { gql } from "@apollo/client";

export const UPDATE_TASK = gql`
  mutation updateTask($where: FlowNodeWhere, $update: FlowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        id
        label
        hasInfo {
          dueDate
          description
          dueDate
          status
        }
      }
    }
  }
`;
