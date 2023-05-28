import React, { useEffect, useState } from 'react';
import { auth } from '../../../auth';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import styles from './Login.module.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        verfiyAuthToken()
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const { user } = userCredential;

                // Access the user's authentication tokens
                user.getIdTokenResult().then((idTokenResult) => {
                    // Retrieve the access token and refresh token
                    const accessToken = idTokenResult.token;
                    const refreshToken = user.refreshToken;

                    // Store the tokens in cookies
                    document.cookie = `accessToken=${accessToken}; Secure; SameSite=Strict; HttpOnly`;
                    document.cookie = `refreshToken=${refreshToken}; Secure; SameSite=Strict; HttpOnly`;
                    router.push("/")
                });

            })
            .catch((error) => {
                const errorCode = error.code;
                console.log('errorCode: ', errorCode);
                const errorMessage = error.message;
                console.log('errorMessage: ', errorMessage);
            });
    };

    const postIdTokenToSessionLogin = (url: string, idToken: any, csrfToken: any) => {

    }

    return (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px' }}
                />
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
