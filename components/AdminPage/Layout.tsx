import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";
import { auth } from "../../auth";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import useStore from "../Sidebar/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: any) {
  const { isSideBarOpen, setIsSideBarOpen } = useStore();
  const [email, setEmail] = useState("");

  const router = useRouter();
  const path =
    router.asPath !== "/signup" &&
    router.asPath !== "/login" &&
    router.asPath !== "/forgot-password";

  const verificationToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email);
      }
    });
  };
  useEffect(() => {
    verificationToken();
  }, [auth]);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className="flex">
      <div>
        {email && path && (
          <Sidebar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
        )}
      </div>
      <div className="w-full">
        {email && path && (
          <TopBar toggleSideBar={toggleSideBar} flag={isSideBarOpen} />
        )}
        <div className="flex flex-grow flex-col  bg-gray-50 dark:bg-slate-900 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
