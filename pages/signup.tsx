import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Signup from "../components/Authentication/SignUp/SignUp";

function SignupPage() {
  const [activeLink, setActiveLink] = useState("Login");
  const router = useRouter();

  useEffect(() => {
  }, [])

  return <Signup />;
}

export default SignupPage;
