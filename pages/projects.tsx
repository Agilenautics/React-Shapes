import React,{ useEffect, useState } from "react";

import Projects from "../components/AdminPage/Projects/Projects";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from '../auth';
// import Sidebar from "../components/Sidebar/Sidebar";

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

  return (
    <div>
      <Projects />
    </div>
  );
}

export default ProjectPage;
