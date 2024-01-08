import {
  DocumentNode,
  TypedDocumentNode,
  OperationVariables,
} from "@apollo/client";
import client from "../../apollo-client";
import { NextApiResponse } from "next";
import { GET_UID } from "./GET_UID";

const getUidMethode = (
  customQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  return client
    .query({
      query: customQuery,
    })
    .then((respons: NextApiResponse | any) => {
      return respons;
    })
    .catch((err) => {
      console.log(err, "getUid");
    });
};
const createUidMethode = (
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  return client
    .mutate({
      mutation,
      variables: {
        input: [
          {
            uid: 1,
          },
        ],
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err, "error while creating uid"));
};
const updateUidMethode = (
  id: string,
  mutation: DocumentNode | TypedDocumentNode<any, OperationVariables>
) => {
  return client
    .mutate({
      mutation,
      variables: {
        where: {
          id,
        },
        update: {
          uid_INCREMENT: 1,
        },
      },
      update: (cache, { data }) => {
        const existinUid = cache.readQuery({
          query: GET_UID,
        });
        // @ts-ignore
        const updatedData = { ...existinUid.uids[0],
          uid: data.updateUids.uids[0].uid,
        };
        cache.writeQuery({
          query: GET_UID,
          data: { uids: [updatedData] },
        });
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err, "error while updating uids"));
};
export { getUidMethode, createUidMethode, updateUidMethode };
