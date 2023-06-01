import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { useEffect } from "react";
import { registerServiceWorker } from "../authServiceWorker";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from '../auth';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    registerServiceWorker();
    verfiyAuthToken()
  }, []);


  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (window.location.pathname.includes("verify-email") && urlParams.has('email'))
          router.push(`/verify-email?email=${urlParams.get('email')}`);
        else
          router.push("/login");
      }
    });
  }

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
