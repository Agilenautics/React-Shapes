import {
     DocumentNode,
    TypedDocumentNode,
    OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";


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

export { updateCommentsBackend,deleteComments }