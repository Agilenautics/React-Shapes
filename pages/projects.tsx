import { useEffect, useState } from "react";
import TopBar from "../components/AdminPage/TopBar";
import Sidebar from "../components/AdminPage/SideBar";
import Projects from "../components/AdminPage/Projects/Projects";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from '../auth';

function ProjectPage() {
  const [activeLink, setActiveLink] = useState("Projects");
  const router = useRouter();

  useEffect(() => {
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
          router.push(`/verify-email${window.location.search}`);
        else if (window.location.pathname.includes("signup"))
          router.push("/signup")
        else
          router.push("/login");
      }
    });
  }

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div>
      <TopBar />
      <div className="flex">
        {/* <Sidebar activeLink={activeLink} onLinkClick={handleLinkClick} /> */}
        <div className="flex flex-grow flex-col bg-gray-50">
          <Projects />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
