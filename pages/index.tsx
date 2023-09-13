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
      <DynamicHeader />
    </>
  );
};

export default Home;
