import React,{ useEffect, useState } from "react";
import { useRouter } from "next/router";
import ResetPassword from "../components/Authentication/Login/ResetPassword";

function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
  }, [])

  return <ResetPassword />;
}

export default ResetPasswordPage;
