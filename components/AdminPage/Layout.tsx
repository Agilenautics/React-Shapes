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

  const getProjects = (response: any) => {
    if (!loading && response && response.users.length) {
      const projects = response.users[0].hasProjects;
      const userType = data.users[0].userType;
      updateUserType(userType)
      updateProjects(projects, loading);
      updateRecycleBinProject(projects);

    }
  }


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
  }, [data])



  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };


  return (
    <div className="flex">
      <div>
        <Sidebar isOpen={isSideBarOpen} />
      </div>
      <div className="w-full">
        <TopBar toggleSideBar={toggleSideBar} flag={isSideBarOpen} />
        <RoutingBreadCrumbs />
        <div className="flex flex-grow flex-col  bg-gray-50 p-6 dark:bg-slate-900 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
