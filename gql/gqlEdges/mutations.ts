import { gql } from "@apollo/client";

import { Edge_Fragment } from "./fragments";

export const allEdges = gql`
  ${Edge_Fragment}
  query Query($where: flowchartWhere) {
    flowcharts(where: $where) {
      name
      edges {
        ...EdgeFragment
      }
    }
  }
`;

// create Edge mutation

export const createEdgeMutation = gql`
  ${Edge_Fragment}
  mutation UpdateFiles($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        hasflowchart {
          name
          edges {
            ...EdgeFragment
          }
        }
      }
    }
  }
`;

export const deleteEdgeMutation = gql`
  mutation deleteFlowEdges(
    $where: flowEdgeWhere
    $delete: flowEdgeDeleteInput
  ) {
    deleteFlowEdges(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
export const updateEdgeMutation = gql`
  mutation updateEdge($where: flowEdgeWhere, $update: flowEdgeUpdateInput) {
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
