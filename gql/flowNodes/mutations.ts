import { gql } from "@apollo/client";

//createNode

export const newNode = gql`
  mutation CreateFlowNodes($input: [FlowNodeCreateInput!]!) {
    createFlowNodes(input: $input) {
      flowNodes {
        id
        draggable
        flowchart
        type
        timeStamp
        uid
        label
        shape
        x
        y
        flowEdge {
          id
          label
          bidirectional
          boxCSS
          pathCSS
          selected
          createdBy {
            id
            emailId
          }

          flowNodeConnection {
            edges {
              handle
              node {
                id
              }
            }
          }
        }
        isLinked {
          id
          label
          isLinkedConnection {
            edges {
              from
            }
          }
          hasFile {
            id
          }
        }
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasComments {
          message
          createdBy {
            emailId
          }
        }
        hasSprint {
          id
          name
        }
        hasFile {
          id
          name
          folderHas {
            id
            name
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
export const linkNodeToAnotherNodeMutation = gql`
  mutation UpdateFlowNodes(
    $where: FlowNodeWhere
    $connect: FlowNodeConnectInput
  ) {
    updateFlowNodes(where: $where, connect: $connect) {
      flowNodes {
        isLinked {
          id
          label
          hasFile {
            id
          }
        }
      }
    }
  }
`;
// export const updateLinkedBy = gql`
//   mutation UpdateLinkedBy($where: LinkedByWhere, $update: LinkedByUpdateInput) {
//     updateLinkedBies(where: $where, update: $update) {
//       linkedBies {
//         fileId
//         flag
//         id
//         label
//       }
//     }
//   }
// `;
// export const updateLinkedToMutation = gql`
//   mutation updateLinkedTo($where: NodeDataWhere, $update: NodeDataUpdateInput) {
//     updateNodeData(where: $where, update: $update) {
//       nodeData {
//         label
//         description
//         shape
//         hasLinkedTo {
//           label
//           id
//           fileId
//           flag
//         }
//       }
//     }
//   }
// `;
export const updateNodesMutation = gql`
  mutation updateFlowNode($where: FlowNodeWhere, $update: FlowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        id
        draggable
        flowchart
        type
        timeStamp
        uid
        label
        shape
        x
        y
        flowEdge {
          id
          label
          bidirectional
          boxCSS
          pathCSS
          selected
          createdBy {
            id
            emailId
          }

          flowNodeConnection {
            edges {
              handle
              node {
                id
              }
            }
          }
        }
        isLinked {
          id
          label
          isLinkedConnection {
            edges {
              from
            }
          }
          hasFile {
            id
          }
        }
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasComments {
          message
          createdBy {
            emailId
          }
        }
        hasSprint {
          id
          name
        }
        hasFile {
          id
          name
          folderHas {
            id
            name
          }
        }
      }
    }
  }
`;

//updete position mutation

export const updatePositionMutation = gql`
  mutation Mutation($where: FlowNodeWhere, $update: FlowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        id
        x
        y
      }
    }
  }
`;
export const deleteIsLinkedNodeMutation = gql`
  mutation UpdateFlowNodes(
    $where: FlowNodeWhere
    $disconnect: FlowNodeDisconnectInput
  ) {
    updateFlowNodes(where: $where, disconnect: $disconnect) {
      flowNodes {
        id
        label
        isLinked {
          label
        }
      }
    }
  }
`;
export const updateTasksMutation = gql`
  mutation updateTasks($where: FlowNodeWhere, $update: FlowNodeUpdateInput) {
    updateFlowNodes(where: $where, update: $update) {
      flowNodes {
        id
        type
        hasInfo {
          description
          assignedTo
          status
          dueDate
        }
        hasSprint {
          name
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
