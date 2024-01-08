import { gql } from "@apollo/client";

export const EDIT_COMMNET = gql`
  mutation UpdateComments($where: CommentWhere, $update: CommentUpdateInput) {
    updateComments(where: $where, update: $update) {
      comments {
        id
        message
      }
    }
  }
`;
