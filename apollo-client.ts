import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";
const API_URL = "http://localhost:3000/api/graphql";
const link = createHttpLink({
  uri: API_URL,
  fetch,
});


const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: API_URL,
  link,
});

export default client;
