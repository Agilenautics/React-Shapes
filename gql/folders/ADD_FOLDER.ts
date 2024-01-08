import {gql} from '@apollo/client'


export const ADD_FOLDER = gql`
mutation CreateFolders($input: [FolderCreateInput!]!) {
  createFolders(input: $input) {
    folders {
      id
      isOpen
      name
      type
      createdBy {
        emailId
      }
      projectHas {
        name
      }
    }
  }
}`