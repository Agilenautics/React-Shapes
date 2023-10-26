import {
    gql
} from "@apollo/client";

export const UPDATE_COMMENTS = gql`
mutation UpdateComments($where: commentsWhere, $update: commentsUpdateInput) {
  updateComments(where: $where, update: $update) {
    comments {
      id
      message
      timeStamp
    }
  }
}
`
export const DELETE_COMMENT = gql`
mutation DeleteComments($where: commentsWhere) {
  deleteComments(where: $where) {
    relationshipsDeleted
    nodesDeleted
  }
}
`
