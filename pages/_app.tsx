import React from 'react';
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../auth";
import Layout from "../components/AdminPage/Layout";
import userStore from "../components/AdminPage/Users/userStore";

function MyApp({ Component, pageProps }: AppProps) {
  const { updateUserEmail } = userStore();
  const router = useRouter();

  useEffect(() => {
    // registerServiceWorker();
    verfiyAuthToken();
  }, []);


  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        updateUserEmail(user.email);
        if (window.location.pathname == "/") router.push("/projects");
      } else {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (
          window.location.pathname.includes("verify-email") &&
          urlParams.has("email")
        )
          router.push(`/verify-email${window.location.search}`);
        else if (window.location.pathname.includes("signup"))
          router.push("/signup");
        else router.push("/login");
      }
    });
  };

  return (
    <div>
      <Head>
        <title>Flowchart</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com/" />
      </Head>
      <ApolloProvider client={client}>
        {/* <Sidebar /> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </div>
  );
}

export default MyApp;
