import React from 'react';
import type { NextPage } from "next";
import dynamic from 'next/dynamic'
import LoadingIcon from "../components/LoadingIcon";
import { ComponentType } from "react";

type LayoutProps = any


const DynamicHeader: ComponentType<LayoutProps> = dynamic(() => import('../components/AdminPage/Layout'), {
  ssr: false,
  loading: () => <LoadingIcon />
})
const Home: NextPage = () => {
  return (
    <>
     
    </>
  );
};

export default Home;

// import type { ReactElement } from 'react'
// import Layout from '../components/AdminPage/Layout'
// import type { NextPageWithLayout } from './_app'
 
// const Page: NextPageWithLayout = () => {
//   return <p>hello world</p>
// }
 
// Page.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <Layout>
//       {page}
//     </Layout>
//   )
// }
 
// export default Page
