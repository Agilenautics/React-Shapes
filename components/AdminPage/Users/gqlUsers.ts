import { DocumentNode, OperationVariables, TypedDocumentNode, gql } from "@apollo/client";
import client from "../../../apollo-client";


const ALL_USERS = gql`
query getUsers {
  users {
    active
    emailId
    userType
    userName
    id
    timeStamp
    hasProjects {
      id
      name
    }
  }
}
`

export {ALL_USERS}