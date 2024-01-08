import { gql } from "@apollo/client";

export const DELETE_COMMENT = gql`
  mutation DeleteComments($where: CommentWhere) {
    deleteComments(where: $where) {
      nodesDeleted
    }
  }
`;
