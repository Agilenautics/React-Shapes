import { gql } from "@apollo/client";

export const ADD_EDGE = gql`
  mutation CreateFlowEdges($input: [FlowEdgeCreateInput!]!) {
    createFlowEdges(input: $input) {
      flowEdges {
        id
        label
        bidirectional
        boxCSS
        pathCSS
        selected
        timeStamp
        flowNodeConnection {
          edges {
            handle
            node {
              id
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
