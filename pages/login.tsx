import React,{ useEffect, useState } from "react";
import { useRouter } from "next/router";
import Login from "../components/Authentication/Login/Login";

function LoginPage() {
  const [activeLink, setActiveLink] = useState("Login");
  const router = useRouter();

  useEffect(() => {
  }, [])

  return <Login />;
}

export default LoginPage;
