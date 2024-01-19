import { gql } from "@apollo/client";
export const GET_PROJECT_BY_ID = gql`
  query Projects($where: ProjectWhere) {
    projects(where: $where) {
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
        }
      }
      hasContainsFile {
        id
        name
        type
      }
    }
  }
`;
