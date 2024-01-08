import { gql } from "@apollo/client";

export const allNodes = gql`
  query getAllNodes($where: FileWhere) {
    files(where: $where) {
      id
      name
      hasNodes {
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

export const getFlowNode = gql`
  query FlowNodes($where: FlowNodeWhere) {
    flowNodes(where: $where) {
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
`;
