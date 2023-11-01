import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import fetch from "cross-fetch";
// const API_URL = "http://localhost:3000/api/graphql"
const API_URL = "https://react-flow-agile-livid.vercel.app/api/graphql"

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}


function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}


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
