import { gql } from "@apollo/client";

export const ADD_NODE = gql`
  mutation CreateFlowNodes($input: [FlowNodeCreateInput!]!) {
    createFlowNodes(input: $input) {
      flowNodes {
        id
        label
        draggable
        shape
        timeStamp
        type
        x
        y
        uid
        isLinked {
          id
          label
          hasFile {
            name
          }
        }
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
        createdBy {
          emailId
        }
      }
    }
  }
`;
