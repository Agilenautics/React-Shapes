import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import client from "../../apollo-client";

const handleUser_Delete = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id,
      },
    },
    refetchQueries: [{ query }],
  });
};

// const ADD_USER = gql`
// mutation AddUser($newUser: userInput!) {
//   addUser(newUser: $newUser) {
//     active
//     emailId
//     userName
//     userType
//   }
// }
// `
const handleUpdate_User = async (
  id: string,
  userType: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id,
      },
      update: {
        userType,
      },
    },
    refetchQueries: [{ query }],
  });
};
const handleGetUsersByProject = async (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id,
      },
    },
    refetchQueries: [{ query }],
  });
};

const allocateProjectToUserMethod = async (
  projectId: string,
  userId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id: userId,
      },
      connect: {
        hasProjects: [
          {
            where: {
              node: {
                id: projectId,
              },
            },
          },
        ],
      },
    },
  });
};

const deAllocateProjectToUserMethod = async (
  projectId: string,
  userId: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  await client.mutate({
    mutation,
    variables: {
      where: {
        id: userId,
      },
      disconnect: {
        hasProjects: [
          {
            where: {
              node: {
                id: projectId,
              },
            },
          },
        ],
      },
    },
  });
};

export {
  handleUser_Delete,
  handleUpdate_User,
  allocateProjectToUserMethod,
  deAllocateProjectToUserMethod,
  handleGetUsersByProject,
};
