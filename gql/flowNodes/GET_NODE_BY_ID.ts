import { gql } from "@apollo/client";

export const GET_NODE_BY_ID = gql`
  query getNodeById($where: FlowNodeWhere) {
    flowNodes(where: $where) {
      id
      label
     
      shape
    }
  }
`;
