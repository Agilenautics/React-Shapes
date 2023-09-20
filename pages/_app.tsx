// import "../styles/globals.css";
// import type { AppProps } from "next/app";
// import Head from "next/head";
// import { ApolloProvider } from "@apollo/client";
// import client from "../apollo-client";
// import { useEffect } from "react";
// import { registerServiceWorker } from "../authServiceWorker";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useRouter } from "next/router";
// import { auth } from '../auth';
// import Sidebar from "../components/Sidebar/Sidebar";
// import Layout from "../components/AdminPage/Layout";

// function MyApp({ Component, pageProps }: AppProps) {
//   const router = useRouter();

//   useEffect(() => {
//     // registerServiceWorker();
//     verfiyAuthToken()
//   }, []);


//   const verfiyAuthToken = async () => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         if (window.location.pathname == "/")
//           router.push("/projects")
//       } else {
//         const queryString = window.location.search;
//         const urlParams = new URLSearchParams(queryString);

//         if (window.location.pathname.includes("verify-email") && urlParams.has('email'))
//           router.push(`/verify-email${window.location.search}`);
//         else if (window.location.pathname.includes("signup"))
//           router.push("/signup")
//         else
//           router.push("/login");
//       }
//     });
//   }

//   return (
//     <>
//       <Head>
//         <title>Flowchart</title>
//         <meta
//           name="viewport"
//           content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
//         />
//         <link rel="preconnect" href="https://fonts.gstatic.com/" />
//       </Head>
//       <ApolloProvider client={client} >
//         {/* <Sidebar /> */}
//         <Layout>
//           <Component {...pageProps} />
//         </Layout>

//       </ApolloProvider>
//     </>
//   );
// }

// export default MyApp;

import { useEffect, type ReactElement, type ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import "../styles/globals.css";
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../auth'
import { useRouter } from 'next/router'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        if (window.location.pathname == "/")
          router.push("/projects")
      } else {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (window.location.pathname.includes("verify-email") && urlParams.has('email'))
          router.push(`/verify-email${window.location.search}`);
        else if (window.location.pathname.includes("signup"))
          router.push("/signup")
        else
          router.push("/login");
      }
    });
  }
  useEffect(() => {
    // registerServiceWorker();
    verfiyAuthToken()
  }, [])


  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)



  return getLayout(
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
