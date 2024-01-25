import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../../auth";
import { getAuth, signOut } from "firebase/auth";

const Signout: React.FC = ({ handleFlag }: any) => {
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/login");
        // handleFlag();
      })
      .catch((error) => {
        // An error happened.
        console.log(error,"error handleSignout")
      });
  };

  return (
    <button
      style={{
        padding: "5px 10px",
        backgroundColor: "#2563EB",
        color: "white",
        border: "none",
        fontSize: "1rem",
      }}
      role="button"
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
};

export default Signout;
