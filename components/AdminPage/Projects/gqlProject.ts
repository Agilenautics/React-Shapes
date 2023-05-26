import { gql } from "@apollo/client";

const GET_PROJECTS = gql`
query getProjets {
  projects {
    id
    isOpen
    name
    timeStamp
    userName
    description
  }
}
`


export {GET_PROJECTS}