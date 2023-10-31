import { gql } from "@apollo/client";
import { Node_Fragment, Info_Fragment } from "./fragments";
import { Edge_Fragment } from "../gqlEdges/fragments";

export const allNodes = gql`
  ${Node_Fragment}
  ${Edge_Fragment}
  query getAllNodes($where: FlowchartWhere) {
    flowcharts(where: $where) {
      name
      hasNodes {
        ...NodeFragment
      }
      hasEdges {
        ...EdgeFragment
      }
    }
  }
`;

export const getNode = gql`
  ${Node_Fragment}
  query FlowNodes($where: FlowNodeWhere) {
    flowNodes(where: $where) {
      ...NodeFragment
    }
  }
`;

//createNode

export const newNode = gql`
  ${Node_Fragment}
  mutation updateFiles($where: FileWhere, $update: FileUpdateInput) {
    updateFiles(where: $where, update: $update) {
      files {
        name
        folderHas {
          name
        }
        hasflowchart {
          name
          hasNodes {
            ...NodeFragment
          }
        }
      }
    }
  }
`;
export const delNodeMutation = gql`
  mutation deleteNode($where: FlowNodeWhere, $delete: FlowNodeDeleteInput) {
    deleteFlowNodes(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;
export const updateLinkedBy = gql`
  mutation UpdateLinkedBy($where: LinkedByWhere, $update: LinkedByUpdateInput) {
    updateLinkedBy(where: $where, update: $update) {
      linkedBy {
        fileId
        flag
        id
        label
      }
    }
  }
`;
export const updateLinkedToMutation = gql`
  mutation updateLinkedTo($where: NodeDataWhere, $update: NodeDataUpdateInput) {
    updateNodeData(where: $where, update: $update) {
      nodeData {
        label
        description
        shape
        hasLinkedTo {
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
  mutation updateFlowNode($where: FlowNodeWhere, $update: FlowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        ...NodeFragment
      }
    }
  }
`;

//updete position mutation

export const updatePositionMutation = gql`
  mutation updatePosition($update: PositionUpdateInput, $where: PositionWhere) {
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
  mutation updateTasks($where: FlowNodeWhere, $update: FlowNodeUpdateInput) {
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
        hasComments {
          id
          message
          timeStamp
          userHas {
            emailId
          }
        }
      }
    }
  }
`;
