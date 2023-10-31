import {
    gql
} from "@apollo/client";

export const UPDATE_COMMENTS = gql`
mutation UpdateComment($where: CommentWhere, $update: CommentUpdateInput) {
  updateComment(where: $where, update: $update) {
    comment {
      id
      message
      timeStamp
    }
  }
}
`
export const DELETE_COMMENT = gql`
mutation DeleteComment($where: CommentWhere) {
  deleteComment(where: $where) {
    relationshipsDeleted
    nodesDeleted
  }
}
`
