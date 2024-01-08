import { gql } from "@apollo/client";

export const ADD_FILE = gql`
  mutation CreateFile($input: [FileCreateInput!]!) {
    createFiles(input: $input) {
      files {
        id
        name
        type
        createdBy {
          emailId
        }
      }
    }
  }
`;
