type ErrorMessages = {
  [key: string]: string;
};

const errorMessages: ErrorMessages = {
  GRAPHQL_VALIDATION_FAILED: "Validation failed",
  GRAPHQL_PARSE_FAILED: "Parse failed",
  BAD_USER_INPUT: "Bad user input",
  UNAUTHENTICATED: "Unauthenticated",
  FORBIDDEN: "Forbidden",
  PERSISTED_QUERY_NOT_FOUND: "Persisted query not found",
  PERSISTED_QUERY_NOT_SUPPORTED: "Persisted query not supported",
};

export default errorMessages;
