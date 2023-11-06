import { gql } from "@apollo/client";
import { Edge_Fragment } from "./fragments";

export const allEdges = gql`
  ${Edge_Fragment}
  query Query($where: FlowchartWhere) {
    flowcharts(where: $where) {
      name
      hasEdges {
        ...EdgeFragment
      }
    }
  }
`;
