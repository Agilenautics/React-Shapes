import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";
const API_URL = "http://localhost:3000/api/graphql";
//const API_URL = process.env.API_URL;
// const API_URL =
//  "https://react-flow-agile-anitha-agilenautics.vercel.app/api/graphql";
// const API_URL = "https://react-flow-agile-omega.vercel.app/api/graphql";
// https://us-central1-fluted-polymer-388415.cloudfunctions.net/graphql
const link = createHttpLink({
  uri: API_URL,
  fetch,
});

// const client = new ApolloClient({
//   //ssrMode:true,
//   uri: "http://localhost:3000/api/graphql",
//   cache: new InMemoryCache(),

// });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: API_URL,
  link,
});

export default client;
