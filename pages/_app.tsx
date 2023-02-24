import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flowchart</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com/" />
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
