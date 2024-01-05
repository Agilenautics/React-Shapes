import { DocumentNode, OperationVariables, TypedDocumentNode, gql } from "@apollo/client";
import client from "../../apollo-client";


const CREATE_ADMIN = gql`
mutation AddUser($newUser: userInput!) {
addUser(newUser: $newUser) {
 active
 emailId
 userName
 userType
 }
}
`

const handle_add_admin = async (email: String, mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>) => {
    await client.mutate({
        mutation,
        variables: {
            newUser: {
                userName: "irfanh",
                active: false,
                emailId: email,
                userType: "Admin"
            }
        }
    })
}


export { CREATE_ADMIN,handle_add_admin }