import { gql } from "@apollo/client";

export const DELETE_EDGE = gql`
 mutation DeleteFlowEdges($where: FlowEdgeWhere) {
    deleteFlowEdges(where: $where) {
      nodesDeleted
    }
  }
`;
