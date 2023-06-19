import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { auth } from '../../../auth';
import { createUserWithEmailAndPassword } from "firebase/auth";
import './SignUp.module.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CREATE_ADMIN, handle_add_admin } from './gqlAdmin';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        verfiyAuthToken()
    }, [])

    const verfiyAuthToken = async () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                router.push("/projects")
                // ...
            } else {
            }
        });
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password != repeatPassword) {
            console.log("Error: Passwords do not match")
        } else {
            createUserWithEmailAndPassword(auth, email, password)
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
                        router.push("/projects")

                    });
                    // Add user to Database
                    // @ts-ignore
                    // handle_add_admin(user.email,CREATE_ADMIN)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    console.log('errorCode: ', errorCode);
                    const errorMessage = error.message;
                    console.log('errorMessage: ', errorMessage);
                    // ..
                });
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Signup</h1>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <input
                    type="password"
                    placeholder="Re-Enter Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px' }}
                />
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none' }}>
                    Signup
                </button>
            </form>
        </div>
    );
};

export default Signup;
