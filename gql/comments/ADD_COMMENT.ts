import { gql } from "@apollo/client";

export const ADD_COMMENTS = gql`
  mutation CreateComments($input: [CommentCreateInput!]!) {
    createComments(input: $input) {
      comments {
        id
        message
        createdBy {
          id
          emailId
        }
      }
    }
  }
`;
