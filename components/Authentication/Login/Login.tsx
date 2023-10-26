import React, { useEffect, useState } from 'react';
import { auth, googleProvider, facebookProvider } from '../../../auth';
import { signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";
import styles from './Login.module.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GET_USER, get_user_method } from '../../../gql';
import { AiOutlineUser } from 'react-icons/ai'
import { BiSolidLockAlt, BiLogoFacebook, BiLogoGoogle } from 'react-icons/bi'
import { TbBrandGithubFilled } from 'react-icons/tb'

import Link from 'next/link';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[projectId,setProjectId]=useState<string | null>(null);
    const [loginError, setLoginError] = useState({
        error: false,
        msg: ''
    })
    const router = useRouter();
    // var projectId = router.query.projectId as string;
    useEffect(()=>{
        const recentPid=localStorage.getItem("recentPid")
            setProjectId(recentPid)
            console.log("RECENTPID IS:",recentPid)
    },[router.query.projectId ])
    

  


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
                //router.push("/projects")
                // const recentPid = localStorage.getItem('recentPid');
                //  setprojectId(recentPid);
                if(projectId!==null){
                    router.push(`/projects/${projectId}`)
                }
                else{
                    router.push("projects")
                }
                
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
                    //router.push("/projects");
                    router.push(`/projects/${projectId}`)
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

    const handleLoginWithGoogle = () => {
        const auth = getAuth();
        signInWithPopup(auth, googleProvider).then((result) => {
            console.log(result);
            const cridential = GoogleAuthProvider.credentialFromResult(result);
            const token = cridential?.accessToken;
        })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
            });

    }


    const handleLoginWithFacebook = () => {
        signInWithPopup(auth, facebookProvider)
            .then((result) => {
                const user = result.user
                const cridential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = cridential?.accessToken;
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);

                // ...
            });

    }

    const handleForgotPassword = () => {
        router.push("/forgot-password")
    }

    return (
        // <div style={{ textAlign: 'center', marginTop: 30 }}>
        //     <h1>Login</h1>
        //     <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        //         <input
        //             type="email"
        //             placeholder="Email"
        //             value={email}
        //             onChange={(e) => setEmail(e.target.value)}
        //             style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px' }}
        //         />
        //         <input
        //             type="password"
        //             placeholder="Password"
        //             value={password}
        //             onChange={(e) => setPassword(e.target.value)}
        //             style={{ marginBottom: '10px', padding: '5px', border: '1px solid black', margin: '10px' }}
        //         />
        //         {
        //             loginError.error && <div className='text-sm text-red-500'>{loginError.msg}</div>
        //         }
        //         <a className="text-blue-600 hover:text-blue-800 cursor-pointer my-2" onClick={handleForgotPassword}>Forgot Password</a>
        //         <button type="submit" style={{ padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none' }}>
        //             Login
        //         </button>
        //     </form>
        // </div>


        // login container


        <div className='font-sans h-screen grid grid-cols-2'>
            {/* image section */}
            <div className=' bg-no-repeat bg-cover bg-fixed' style={{ backgroundImage: `url(/assets/loginImage.jpg)` }}   >

            </div>
            {/* login form section */}
            <div className='p-8'>
                <h2 className='text-4xl text-center'>WELCOME</h2>
                <div className=' flex flex-col gap-7 ml-14 mr-14  p-14 '>
                    <div className='text-center flex  justify-center'>
                        <img src="/assets/userpng.png" height='90rem' width='90rem' alt="" />
                    </div>
                    <form action="" onSubmit={handleLogin} className=' grid-cols-1 grid gap-6  '>
                        {/* email */}
                        <div className='border flex border-black  p-1'>
                            <div className=' flex items-center text-gray-500'>
                                <AiOutlineUser />
                            </div>
                            <div className='p-1'>
                                <input className='outline-none ' type="text" name='email' placeholder='Email Address' id='email' value={email} autoComplete='off' onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>
                        {/* password */}
                        <div>
                            <div className='border flex border-black  p-1'>
                                <div className='flex items-center text-gray-500'>
                                    <BiSolidLockAlt />
                                </div>
                                <div className='p-1'>
                                    <input className='outline-none ' type="password" placeholder='Password' name='password' id='password' value={password} autoComplete='off' onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                            </div>
                            {loginError.error && <div className='text-red-500'>{loginError.msg}</div>}
                        </div>
                        {/* 
                        <div className='bg-blue-700/75 text-white text-center p-2 rounded'>
                            <input type='submit' value="Login" className='cursor-pointer w-fit ' />
                        </div> */}
                        <button type='submit' className='bg-blue-700 text-white p-2 rounded hover:bg-blue-700/75 duration-300'>Login</button>


                    </form>
                    <div className='flex justify-between'>
                        <Link href={`/forgot-password`}>FORGOT PASSWORD?</Link>
                        <div>NEW USER? <Link href={`/signup`} >RESISTER</Link > </div>
                    </div>
                    <div className='flex gap-4 '>
                        <div>Or Loging Using :</div>
                        <div className='rounded-full border border-blue-700 flex items-center text-white hover:bg-transparent hover:text-blue-700 duration-300 bg-blue-700'>
                            <button className='text-lg p-1' onClick={handleLoginWithFacebook} > <BiLogoFacebook /> </button>
                        </div>
                        <div className='rounded-full border border-red-700 flex items-center text-white hover:bg-transparent hover:text-red-700 duration-300 bg-red-700'>
                            <button className='text-xl p-1' onClick={handleLoginWithGoogle} > <BiLogoGoogle /> </button>
                        </div>
                        <div className='rounded-full border border-black flex items-center text-white hover:bg-transparent hover:text-black duration-300 bg-black'>
                            <button className='text-xl p-1'> <TbBrandGithubFilled /> </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Login;
