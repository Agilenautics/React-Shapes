import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation CreateTask($input: [FlowNodeCreateInput!]!) {
    createFlowNodes(input: $input) {
      flowNodes {
        id
        label
        type
        shape
        x
        y
        uid
        hasInfo {
          description
          status
          assignedTo
          dueDate
        }
        hasFile {
          id
          name
        }
        hasSprint {
          id
          name
        }
        hasComments {
          id
          message
          createdBy {
            emailId
          }
        }
      }
    }
  }
`;
