import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";
const API_URL = process.env.API_URL
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
