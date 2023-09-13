import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";
import { auth } from "../../auth";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
  activeLink: string;
  onLinkClick: (link: string) => void;
}





function Layout({ children, activeLink, onLinkClick }: LayoutProps) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [email, setEmail] = useState('');





  const router = useRouter()
  const path = (router.asPath !== "/signup") && (router.asPath !== '/login') && (router.asPath !== '/forgot-password')


  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        setEmail(user.email);
      }
    })
  }
  useEffect(() => {
    verificationToken()
  }, [auth])



  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  


 



  return (
    <div className="flex">
      <div>
        {
          email && path && <Sidebar isOpen={isSideBarOpen} />
        }
      </div>
      <div className="w-full">
        {
          email && path && (
            <>
              <TopBar toggleSideBar={toggleSideBar} flag={isSideBarOpen} />
              {/* <RoutingBreadCrumbs loading={loading} /> */}
            </>
          )
        }
        <div className="flex flex-grow flex-col  bg-gray-50 dark:bg-slate-900 dark:text-slate-100">
          {/* {
            email && path && <RoutingBreadCrumbs />
          } */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
