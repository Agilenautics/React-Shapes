import { gql } from "@apollo/client";

export const ADD_STORY = gql`
  mutation AddStory($input: [FileCreateInput!]!) {
    createFiles(input: $input) {
      files {
        id
        name
        type
        folderHas {
          id
          name
        }
        projectHas {
          id
          name
        }
        hasInfo {
          assignedTo
          dueDate
          description
          status
        }
        hasSprint {
          id
          name
        }
      }
    }
  }
`;
