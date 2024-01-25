import React, { useEffect, useState } from "react";
import { auth } from "../../../auth"; //googleProvider, facebookProvider
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AiOutlineUser } from "react-icons/ai";
import { BiSolidLockAlt, BiLogoFacebook, BiLogoGoogle } from "react-icons/bi";
import { TbBrandGithubFilled } from "react-icons/tb";
import Link from "next/link";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState({
    error: false,
    msg: "",
  });
  const router = useRouter();
  // var projectId = router.query.projectId as string;
  useEffect(() => {
    const recentPid = localStorage.getItem("recentPid");
    setProjectId(recentPid);
  }, [router.query.projectId]);

  useEffect(() => {
    verfiyAuthToken();
  }, []);

  const verfiyAuthToken = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        router.push(`/projects`);
      } else {
        //here we need to perform if user is unuthenticate
      }
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        setLoginError({
          error: false,
          msg: "",
        });
        // Access the user's authentication tokens
        user.getIdTokenResult().then((idTokenResult) => {
          // Retrieve the access token and refresh token
          const accessToken = idTokenResult.token;
          const refreshToken = user.refreshToken;
          //  check if active == true
          // Store the tokens in cookies
          document.cookie = `accessToken=${accessToken}; Secure; SameSite=Strict; HttpOnly`;
          document.cookie = `refreshToken=${refreshToken}; Secure; SameSite=Strict; HttpOnly`;
          router.push(`/projects/`);
        });
        // User logged in
        // get_user_method(user.email, GET_USER)
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("errorCode: ", errorCode);
        const errorMessage = error.message;
        console.log("errorMessage: ", errorMessage);
        setLoginError({
          error: true,
          msg: "Incorrect credentials. Check your email and password and try again.",
        });
      });
  };

  const handleLoginWithGoogle = () => {
    //   const auth = getAuth();
    //   signInWithPopup(auth, googleProvider)
    //     .then((result) => {
    //       console.log(result);
    //       const cridential = GoogleAuthProvider.credentialFromResult(result);
    //       const token = cridential?.accessToken;
    //     })
    //     .catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       // The email of the user's account used.
    //       const email = error.customData.email;
    //       // The AuthCredential type that was used.
    //       const credential = GoogleAuthProvider.credentialFromError(error);
    //     });
  };

  const handleLoginWithFacebook = () => {
    //   signInWithPopup(auth, facebookProvider)
    //     .then((result) => {
    //       const user = result.user;
    //       const cridential = FacebookAuthProvider.credentialFromResult(result);
    //       const accessToken = cridential?.accessToken;
    //     })
    //     .catch((error) => {
    //       // Handle Errors here.
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       // The email of the user's account used.
    //       const email = error.customData.email;
    //       // The AuthCredential type that was used.
    //       const credential = FacebookAuthProvider.credentialFromError(error);
    //       // ...
    //     });
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

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

    <div className="grid h-screen grid-cols-2 font-sans">
      {/* image section */}
      <div
        className=" bg-cover bg-fixed bg-no-repeat"
        style={{ backgroundImage: `url(/assets/loginImage.jpg)` }}
      ></div>
      {/* login form section */}
      <div className="p-8">
        <h2
          className="text-center text-4xl"
          data-test-id="login-button-element"
        >
          WELCOME
        </h2>
        <div className=" ml-14 mr-14 flex flex-col gap-7  p-14 ">
          <div className="flex justify-center  text-center">
            <img
              src="/assets/userpng.png"
              height="90rem"
              width="90rem"
              alt=""
            />
          </div>
          <form
            action=""
            onSubmit={handleLogin}
            className=" grid grid-cols-1 gap-6  "
          >
            {/* email */}
            <div className="flex border border-black  p-1">
              <div className=" flex items-center text-gray-500">
                <AiOutlineUser />
              </div>
              <div className="p-1">
                <input
                  className="outline-none "
                  type="text"
                  name="email"
                  placeholder="Email Address"
                  id="email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* password */}
            <div>
              <div className="flex border border-black  p-1">
                <div className="flex items-center text-gray-500">
                  <BiSolidLockAlt />
                </div>
                <div className="p-1">
                  <input
                    className="outline-none "
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="password"
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {loginError.error && (
                <div className="text-red-500">{loginError.msg}</div>
              )}
            </div>
            {/* 
                        <div className='bg-blue-700/75 text-white text-center p-2 rounded'>
                            <input type='submit' value="Login" className='cursor-pointer w-fit ' />
                        </div> */}
            <button
              type="submit"
              className="rounded bg-blue-700 p-2 text-white duration-300 hover:bg-blue-700/75"
            >
              Login
            </button>
          </form>
          <div className="flex justify-between">
            <Link href={`/forgot-password`}>FORGOT PASSWORD?</Link>
            <div>
              NEW USER? <Link href={`/signup`}>RESISTER</Link>{" "}
            </div>
          </div>
          <div className="flex gap-4 ">
            <div>Or Loging Using :</div>
            <div
              className="flex items-center rounded-full border border-blue-700 bg-blue-700 text-white duration-300 hover:bg-transparent hover:text-blue-700"
              data-test-id="testiconid1"
            >
              <button className="p-1 text-lg" onClick={handleLoginWithFacebook}>
                {" "}
                <BiLogoFacebook />{" "}
              </button>
            </div>
            <div
              className="flex items-center rounded-full border border-red-700 bg-red-700 text-white duration-300 hover:bg-transparent hover:text-red-700"
              data-test-id="testiconid2"
            >
              <button className="p-1 text-xl" onClick={handleLoginWithGoogle}>
                {" "}
                <BiLogoGoogle />{" "}
              </button>
            </div>
            <div
              className="flex items-center rounded-full border border-black bg-black text-white duration-300 hover:bg-transparent hover:text-black"
              data-test-id="testiconid3"
            >
              <button className="p-1 text-xl">
                {" "}
                <TbBrandGithubFilled />{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
