import { gql } from "@apollo/client";

export const GET_BOARDS = gql`
  query Projects($where: ProjectWhere) {
    projects(where: $where) {
      id
      name
      createdBy {
        emailId
      }
      hasContainsFolder {
        id
        name
        type
        hasInfo {
          status
        }
        hasFile {
          id
          name
          type
          hasInfo {
            status
          }
          hasNodes {
            id
            label
            type
            hasInfo {
              status
            }
          }
        }
      }
      hasContainsFile {
        id
        name
        type
        hasInfo {
          status
        }
        hasNodes {
          id
          label
          type
          hasInfo {
            status
          }
        }
      }
    }
  }
`;
