import React, { useEffect, useState } from 'react';
import { auth } from '../../../auth';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import styles from './Login.module.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GET_USER, get_user_method } from '../../AdminPage/Projects/gqlProject';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState({
        error: false,
        msg: ''
    })
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
                router.push("/projects")
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

                setLoginError({
                    error: false,
                    msg: ""
                })

                // Access the user's authentication tokens
                user.getIdTokenResult().then((idTokenResult) => {
                    // Retrieve the access token and refresh token
                    const accessToken = idTokenResult.token;
                    const refreshToken = user.refreshToken;

                    //  check if active == true


                    // Store the tokens in cookies
                    document.cookie = `accessToken=${accessToken}; Secure; SameSite=Strict; HttpOnly`;
                    document.cookie = `refreshToken=${refreshToken}; Secure; SameSite=Strict; HttpOnly`;
                    router.push("/projects")
                });
                // User logged in 
                // @ts-ignore
                // get_user_method(user.email, GET_USER)
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log('errorCode: ', errorCode);
                const errorMessage = error.message;
                console.log('errorMessage: ', errorMessage);
                setLoginError({
                    error: true,
                    msg: "Incorrect credentials. Check your email and password and try again."
                })
            });
    };

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
                {
                    loginError.error && <div className='text-sm text-red-500'>{loginError.msg}</div>
                }
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
