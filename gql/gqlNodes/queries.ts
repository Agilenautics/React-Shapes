import { gql } from "@apollo/client";
import { Node_Fragment } from "./fragments";
import { Edge_Fragment } from "../gqlEdges/fragments";

export const allNodes = gql`
  ${Node_Fragment}
  query getAllNodes($where: FileWhere) {
    files(where: $where) {
      name
      hasNodes {
        ...NodeFragment
      }
      
    }
  }
`;

export const getFlowNode = gql`
  ${Node_Fragment}
  query FlowNodes($where: FlowNodeWhere) {
    flowNodes(where: $where) {
      ...NodeFragment
    }
  }
`;
