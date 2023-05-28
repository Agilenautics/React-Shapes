import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { useEffect } from "react";
import { registerServiceWorker } from "../authServiceWorker";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import {auth} from '../auth';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    registerServiceWorker();
    verfiyAuthToken()
  }, []);


  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("user", user)
        // ...
      } else {
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
