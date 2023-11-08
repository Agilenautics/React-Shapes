import React,{ useEffect, useState } from "react";
import { useRouter } from "next/router";
import FinishSignIn from "../components/Authentication/SignInLink/finishSignIn";

function FinishSignInPage() {
  const [activeLink, setActiveLink] = useState("verify-email");
  const router = useRouter();

  useEffect(() => {
  }, [])

  return <FinishSignIn />;
}

export default FinishSignInPage;
