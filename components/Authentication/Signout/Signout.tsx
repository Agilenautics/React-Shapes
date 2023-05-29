import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { auth } from '../../../auth';
import { getAuth, signOut } from "firebase/auth";

const Signout: React.FC = () => {
    const router = useRouter();

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            router.push("/login")
        }).catch((error) => {
            // An error happened.
        });
    }

    return <button onClick={handleSignOut}>Sign Out</button>
}

export default Signout;