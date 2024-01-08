import { gql } from "@apollo/client";
export const GET_PROJECT_BY_ID = gql`
  query Projects {
    projects {
      id
      name
      recycleBin
      description
      createdBy {
        emailId
      }
      usersInProjects {
        id
        emailId
        userType
      }
      hasContainsFolder {
        id
        type
        name
        hasFile {
          id
          type
          name
          hasNodes {
            id
            label
            type
          }
        }
      }
      hasContainsFile {
        id
        name
        type
        hasNodes {
          id
          label
          type
        }
      }
    }
  }
`;