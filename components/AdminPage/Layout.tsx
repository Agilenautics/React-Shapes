import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../Sidebar/Sidebar";
import TopBar from "./TopBar";
import { auth } from "../../auth";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: React.ReactNode;
}





function Layout({ children }:any) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [email, setEmail] = useState('');





  const router = useRouter()
  const path = (router.asPath !== "/signup") && (router.asPath !== '/login') && (router.asPath !== '/forgot-password')


  const verificationToken = async () => {
    onAuthStateChanged(auth, user => {
      if (user && user.email) {
        setEmail(user.email);
      }
    })
  }
  useEffect(() => {
    verificationToken()
  }, [auth])



  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };








  return (
    <div className="flex">
      <div>
        {
          email && path && <Sidebar isOpen={isSideBarOpen} />
        }
      </div>
      <div className="w-full">
        {
          email && path && (
            <>
              <TopBar toggleSideBar={toggleSideBar} flag={isSideBarOpen} />
              {/* <RoutingBreadCrumbs loading={loading} /> */}
            </>
          )
        }
        <div className="flex flex-grow flex-col  bg-gray-50 dark:bg-slate-900 dark:text-slate-100">
          {/* {
            email && path && <RoutingBreadCrumbs />
          } */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;

// import React, { useEffect, useState } from 'react'
// import { auth } from '../../auth';
// import { onAuthStateChanged } from 'firebase/auth';
// import { useRouter } from 'next/router';
// import Sidebar from '../Sidebar/Sidebar';
// import TopBar from './TopBar';
// // import useSWR from 'swr'
// // import Navbar from './navbar'
// // import Footer from './footer'

// export default function Layout({ children }: any) {
//   // const { data, error } = useSWR('/api/navigation', fetcher)

//   // if (error) return <div>Failed to load</div>
//   // if (!data) return <div>Loading...</div>

//   const [isSideBarOpen, setIsSideBarOpen] = useState(true);
//   const [email, setEmail] = useState('');





//   const router = useRouter()
//   const path = (router.asPath !== "/signup") && (router.asPath !== '/login') && (router.asPath !== '/forgot-password')


//   const verificationToken = async () => {
//     onAuthStateChanged(auth, user => {
//       if (user && user.email) {
//         setEmail(user.email);
//       }
//     })
//   }
//   useEffect(() => {
//     verificationToken()
//   }, [auth])



//   const toggleSideBar = () => {
//     setIsSideBarOpen(!isSideBarOpen);
//   };


//   return (
//     <div className="flex">
//       <div>
//         {
//           email && path && <Sidebar isOpen={isSideBarOpen} />
//         }
//       </div>
//       <div className="w-full">
//         {
//           email && path && (
//             <>
//               <TopBar toggleSideBar={toggleSideBar} flag={isSideBarOpen} />
//               {/* <RoutingBreadCrumbs loading={loading} /> */}
//             </>
//           )
//         }
//         <div className="flex flex-grow flex-col  bg-gray-50 dark:bg-slate-900 dark:text-slate-100">
//           {/* {
//             email && path && <RoutingBreadCrumbs />
//           } */}
//           {children}
//         </div>
//       </div>
//     </div>
//   )
// }
