import React,{ useEffect, useState } from "react";
import { useRouter } from "next/router";
import Login from "../components/Authentication/Login/Login";
import Signup from "../components/Authentication/SignUp/SignUp";

function App() {
  const [activeLink, setActiveLink] = useState("Login");
  const router = useRouter();

  useEffect(() => {
    console.log("router", router);
  }, []);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    if (link === "Login") {
      router.push("/login");
    } else if (link === "Signup") {
      router.push("/signup");
    }
  };

  const renderPage = () => {
    if (activeLink === "Login") {
      return <Login />;
    } else if (activeLink === "Signup") {
      return <Signup />;
    }
    return null;
  };

  return <>{renderPage()}</>;
}

export default App;
