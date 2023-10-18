import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { auth } from '../../../auth';
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({
        show: false,
        type: '',
        msg: ''
    })
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
                router.push("/projects")
                // ...
            } else {
            }
        });
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.length == 0) {
            setMessage({
                show: true,
                type: 'error',
                msg: 'Please enter a valid email address'
            })
        } else {
            const actionCodeSettings = {
                url: `${window.location.origin}/reset-password?email=${email}`,
                handleCodeInApp: true
            };

            sendPasswordResetEmail(auth, email, actionCodeSettings)
                .then(() => {
                    console.log("Password reset email sent!")
                    setMessage({
                        show: true,
                        type: 'success',
                        msg: 'Password reset email sent successfully. Check your email'
                    })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    console.log('errorCode: ', errorCode);
                    const errorMessage = error.message;
                    console.log('errorMessage: ', errorMessage);
                    setMessage({
                        show: true,
                        type: 'error',
                        msg: "Error in sending email. Please check if the email address is correct"
                    })
                    // ..
                });
        }
    };

    return (
        <div className='my-4 text-center' style={{ textAlign: 'center' }}>
            <h1>Send Password Reset Email</h1>
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px', opacity: 0.7 }}
                />
                {
                    message.show && <div className={`text-sm mb-2 ${message.type == "success" ? "text-green-500" : "text-red-500"}`}>{message.msg}</div>
                }
                <button type="submit" style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none' }}>
                    Submit
                </button>
            </form>
        </div>
    );
};


export default ForgotPassword;