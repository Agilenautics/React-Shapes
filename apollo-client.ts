import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";
const API_URL = "https://react-flow-agile-irfan-agilenautics.vercel.app/api/graphql";
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
