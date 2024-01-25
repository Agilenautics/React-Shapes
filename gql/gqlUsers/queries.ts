import {gql} from "@apollo/client";
export const ALL_USERS = gql`
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
export const GET_USERS_ByProject = gql`
query Query($where: UserWhere) {
  users(where: $where) {
   emailId 
   userType
  }
}`