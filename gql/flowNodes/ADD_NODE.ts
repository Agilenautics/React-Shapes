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
       
        nodeColor
        x
        y
        uid
        hasInfo {
          description
        }
        createdBy {
          emailId
        }
      }
    }
  }
`;
