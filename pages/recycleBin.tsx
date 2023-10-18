import { useEffect, useState } from "react";
import RecycleBin from "../components/AdminPage/Projects/RecycleBin";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from '../auth';



function RecyclePage() {
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
    <div className="h-full">
      <RecycleBin />
    </div>
  );
}

export default RecyclePage;
