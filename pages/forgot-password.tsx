import React,{ useEffect, useState } from "react";
import { useRouter } from "next/router";
import ForgotPassword from "../components/Authentication/Login/ForgotPassword";

function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
  }, [])

  return <ForgotPassword />;
}

export default ForgotPasswordPage;
