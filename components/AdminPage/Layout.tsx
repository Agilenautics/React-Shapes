import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";
import { auth } from "../../auth";
import { useQuery } from "@apollo/client";
import { GET_USER } from "./Projects/gqlProject";
import projectStore from "./Projects/projectStore";
import userStore from "./Users/userStore";
import RoutingBreadCrumbs from "../RoutingBreadCrumbs";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
  activeLink: string;
  onLinkClick: (link: string) => void;
}


function Layout({ children, activeLink, onLinkClick }: LayoutProps) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [email, setEmail] = useState('');

  //project store
  const updateProjects = projectStore((state) => state.updateProjectData);
  const updateRecycleBinProject = projectStore((state) => state.updateRecycleBinProject);


  const updateUserType = userStore((state) => state.updateUserType)

  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      where: {
        emailId: email
      }
    }
  });


  const router = useRouter()

  const getProjects = (response: any) => {
    if (!loading && response && response.users.length) {
      const projects = response.users[0].hasProjects;
      const userType = data.users[0].userType;
      updateUserType(userType)
      updateProjects(projects, loading);
      updateRecycleBinProject(projects);
    }
  }

  const path = (router.asPath !== "/signup") && (router.asPath !== '/login') && (router.asPath !== '/forgot-password')


  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        setEmail(user.email);
        getProjects(data)
      }
    })
  }
  useEffect(() => {
    verificationToken()
  }, [data, auth, error, loading])



  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  if (error) {
    return <div>Error:{error.message}</div>;
  }


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
              <RoutingBreadCrumbs />
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
