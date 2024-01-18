import { gql } from "@apollo/client";

export const ADD_PROJECT = gql`
  mutation CreateProjects($input: [ProjectCreateInput!]!) {
    createProjects(input: $input) {
      projects {
        id
        name
        description
        recycleBin
        timeStamp
        usersInProjects {
          id
          emailId
        }
      }
    }
  }
`;
