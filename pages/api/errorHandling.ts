import { GraphQLError } from "graphql";
import errorMessages from "./errorMessages";
import { ApolloError } from "apollo-server-core";
import logger from "./logger";

const errorHandling = (error: GraphQLError) => {
  const { extensions, ...formatedError } = error;
  const { code } = extensions as { code: string };
  switch (code) {
    case "GRAPHQL_VALIDATION_FAILED":
    case "GRAPHQL_PARSE_FAILED":
    case "BAD_USER_INPUT":
    case "UNAUTHENTICATED":
    case "FORBIDDEN":
    case "PERSISTED_QUERY_NOT_FOUND":
    case "PERSISTED_QUERY_NOT_SUPPORTED":
      logger?.warn(`code:${code},(${error.message})`);
      return new ApolloError(errorMessages[code], code);
    default:
      logger?.error(`code:${code},(${error.message})`);
      return new ApolloError("Internal server error.", code);
  }
};

export default errorHandling;
