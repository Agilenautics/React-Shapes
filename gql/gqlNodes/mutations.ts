import { gql } from "@apollo/client";
import { Node_Fragment, Info_Fragment } from "./fragments";
import { Edge_Fragment } from "../gqlEdges/fragments";

//createNode

export const newNode = gql`
  ${Node_Fragment}
  mutation CreateFlowNodes($input: [FlowNodeCreateInput!]!) {
    createFlowNodes(input: $input) {
      flowNodes {
        ...NodeFragment
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
    updateLinkedBies(where: $where, update: $update) {
      linkedBies {
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
          createdBy {
            emailId
          }
        }
      }
    }
  }
`;
