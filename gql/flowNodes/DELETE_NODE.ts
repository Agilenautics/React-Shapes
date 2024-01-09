import { gql } from "@apollo/client";

export const DELETE_NODE = gql`
  mutation DeleteFlowNodes(
    $where: FlowNodeWhere
    $delete: FlowNodeDeleteInput
  ) {
    deleteFlowNodes(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
