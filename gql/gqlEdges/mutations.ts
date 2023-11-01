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

// create Edge mutation

export const createEdgeMutation = gql`
  ${Edge_Fragment}
  mutation updateFiles($where: FileWhere, $update: FileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasFlowchart {
          name
          hasEdges {
            ...EdgeFragment
          }
        }
      }
    }
  }
`;

export const deleteEdgeMutation = gql`
  mutation deleteFlowEdges(
    $where: FlowEdgeWhere
    $delete: FlowEdgeDeleteInput
  ) {
    deleteFlowEdges(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
export const updateEdgeMutation = gql`
  mutation updateEdge($where: FlowEdgeWhere, $update: FlowEdgeUpdateInput) {
    updateFlowEdges(where: $where, update: $update) {
      flowEdges {
        hasedgedataEdgedata {
          label
          bidirectional
          boxCSS
        }
      }
    }
  }
`;
