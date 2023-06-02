import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { auth } from '../../../auth';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } from "firebase/auth";

const FinishSignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    verfiyAuthToken()
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    setEmail(urlParams.get('email') || "")
  }, [])

  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("user", user)
        router.push("/")
        // ...
      } else {
      }
    });
  }

  const handleSignup = async (e: React.FormEvent) => {
    // Confirm the link is a sign-in with email link.
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('errorMessage: ', errorMessage);
        });
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Complete Sign In</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px', opacity: 0.7 }}
          disabled={true}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px' }}
        />
        <input
          type="password"
          placeholder="Re-Enter Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px' }}
        />
        <button type="submit" style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none' }}>
          Submit
        </button>
      </form>
    </div>
  );
};


export default FinishSignIn;