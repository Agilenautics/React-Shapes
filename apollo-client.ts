import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import fetch from "cross-fetch";
import { getCookie } from "./components/Authentication/helpers";
const API_URL = process.env.BASE_URL










const link = createHttpLink({
  uri: API_URL,
  fetch,
});

const authLink = setContext((_, { headers }) => {
  const token = getCookie('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: API_URL,
  link : authLink.concat(link),
});

export default client;
