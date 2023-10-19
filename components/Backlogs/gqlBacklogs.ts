import {
    gql, DocumentNode,
    TypedDocumentNode,
    OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";


const UPDATE_COMMENTS = gql`
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
const updateCommentsBackend = async (id: string, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>, data: any) => {
    return await client.mutate({
        mutation,
        variables: {
            where: {
                id
            },
            update: {
                message: data.message
            }
        }
    })
}

const DELETE_COMMENT = gql`
mutation DeleteComments($where: commentsWhere) {
  deleteComments(where: $where) {
    relationshipsDeleted
    nodesDeleted
  }
}
`
const deleteComments =async (id:string,mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
    return await client.mutate({
        mutation,
        variables:{
            where:{
                id
            }
        }
    })
}

export { UPDATE_COMMENTS, updateCommentsBackend,DELETE_COMMENT,deleteComments }