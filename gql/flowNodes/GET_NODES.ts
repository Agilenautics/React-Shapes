import {gql} from '@apollo/client'


export const GET_NODES = gql`query getAllNodes($where: FileWhere) {
  files(where: $where) {
    id
    name
    hasNodes {
      id
      timeStamp
      label
      type
      draggable
      shape
      x
      y
      hasInfo {
        description
      }
      createdBy {
        emailId
      }
      isLinked {
        id
        label
        hasFile {
          id
        }
      }
      flowEdge {
        id
        label
        bidirectional
        boxCSS
        pathCSS
        selected
        flowNodeConnection {
          edges {
            handle
            node {
              id
            }
          }
        }
      }
    }
  }
}
`