import { gql } from "@apollo/client";
import { Node_Fragment, Info_Fragment } from "./fragments";
import { Edge_Fragment } from "../gqlEdges/fragments";

export const allNodes = gql`
  ${Node_Fragment}
  ${Edge_Fragment}
  query getAllNodes($where: flowchartWhere) {
    flowcharts(where: $where) {
      name
      nodes {
        ...NodeFragment
      }
      edges {
        ...EdgeFragment
      }
    }
  }
`;

export const getNode = gql`
  ${Node_Fragment}
  query FlowNodes($where: flowNodeWhere) {
    flowNodes(where: $where) {
      ...NodeFragment
    }
  }
`;

//createNode

export const newNode = gql`
  ${Node_Fragment}
  mutation UpdateFiles($where: fileWhere, $update: fileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        folderHas {
          name
        }
        hasflowchart {
          name
          nodes {
            ...NodeFragment
          }
        }
      }
    }
  }
`;
export const delNode = gql`
  mutation deleteNode($where: flowNodeWhere, $delete: flowNodeDeleteInput) {
    deleteFlowNodes(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
export const updateLinkedBy = gql`
  mutation UpdateLinkedBy($where: linkedWhere, $update: linkedUpdateInput) {
    updateLinkeds(where: $where, update: $update) {
      linkeds {
        fileId
        flag
        id
        label
      }
    }
  }
`;
export const updateLinksMutation = gql`
  mutation updateLinks($where: nodeDataWhere, $update: nodeDataUpdateInput) {
    updateNodeData(where: $where, update: $update) {
      nodeData {
        label
        description
        shape
        links {
          label
          id
          fileId
          flag
        }
      }
    }
  }
`;
export const updateNodesMutation = gql`
  ${Node_Fragment}
  mutation updateFlowNode($where: flowNodeWhere, $update: flowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        ...NodeFragment
      }
    }
  }
`;

//updete position mutation

export const updatePositionMutation = gql`
  mutation updatePosition($update: positionUpdateInput, $where: positionWhere) {
    updatePositions(update: $update, where: $where) {
      positions {
        name
        x
        y
        flownodeHasposition {
          id
        }
      }
    }
  }
`;
export const updateTasksMutation = gql`
  ${Info_Fragment}
  mutation updateTasks($where: flowNodeWhere, $update: flowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        id
        type
        hasInfo {
          ...InfoFragment
        }
        hasSprint {
          name
        }
        hasdataNodedata {
          label
          description
        }
        comments {
          id
          message
          timeStamp
          user {
            emailId
          }
        }
      }
    }
  }
`;
