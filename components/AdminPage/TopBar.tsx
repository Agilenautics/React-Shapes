import { useEffect, useState } from "react";
import Signout from "../Authentication/Signout/Signout";
//import { auth } from "../../auth";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

import { BsFillSunFill } from "react-icons/bs";
import { useDarkMode } from "../Sidebar/DarkModeToggleButton";
import { FaBars } from 'react-icons/fa'
import { HiMiniXMark } from 'react-icons/hi2'
import DarkModeToggleButton from "../Sidebar/DarkModeToggleButton";

const auth = getAuth();

function getInitials(name: string) {
  const nameArray = getNameFromEmail(name);
  const initials = [nameArray].map((name) => name.charAt(0)).join("");
  return initials;
}

const getNameFromEmail = (email: string) => {
  let regex = /[^a-z]/gi;
  const name = email.split("@")[0].toLocaleUpperCase();
  return name.replace(regex, "");
};

interface Flag {
  toggleSideBar: () => void
  flag: Boolean;
}

function TopBar({ toggleSideBar, flag }: Flag) {
  const [dropdownOpen, setDropdownOpen] = useState<Boolean>(false);



 



  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [email, setEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email);
      }
    });
  }, [auth]);



  return (
    <div className="sticky left-0  right-0 top-0 shadow-bottom    z-50 flex justify-between bg-white  p-2 px-6 font-sans  dark:bg-slate-600">
      {/* logo  */}
      <div className="flex gap-6">
        {/* <div
        className={` z-50 rounded p-1 border duration-700 ease-in-out focus:outline-none ${showSidebar ? "bg-transparent" : "bg-white dark:bg-neutral-900"
          }`}
      >
        <button
          className="group flex h-10 w-10 flex-col items-center rounded"
          onClick={toggleSideBar}
        >
          <div
            className={`${genericHamburgerLine} ${menuOpen === "h-fit" ? "translate-y-3 rotate-45" : ""
              }`}
          />
          <div
            className={`${genericHamburgerLine} ${menuOpen === "h-fit" ? "opacity-0" : ""
              }`}
          />
          <div
            className={`${genericHamburgerLine} ${menuOpen === "h-fit" ? "-translate-y-3 -rotate-45 " : ""
              }`}
          />
        </button>

      </div> */}

        <button onClick={toggleSideBar} className=" duration-200"> {flag ? <HiMiniXMark className="text-3xl" /> : <FaBars className="text-2xl" />} </button>
        <span className=" text-2xl font-bold text-gray-400">
          <Link href={`/projects`}>FLOWCHART</Link>
        </span>
      </div>
      {/* links */}
      <div className="flex items-center justify-around gap-8 text-[1rem]  font-normal dark:text-white ">
        <div className=" rounded  px-2 py-1 transition duration-300 hover:bg-slate-100 hover:text-slate-500">
          <Link href="/projects">projects</Link>
        </div>
        <div className="rounded  px-2 py-1 transition duration-300 hover:bg-slate-100 hover:text-slate-500">
          <Link href="/users">users</Link>
        </div>
        <div className="rounded  px-2 py-1 transition duration-300 hover:bg-slate-100 hover:text-slate-500">
          <Link href="/Policies">policies</Link>
        </div>
        <div>
          <DarkModeToggleButton />
        </div>
        <div className="relative">
          <button
            className="mr-12 flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white"
            onClick={toggleDropdown}
          >
            {getInitials(email)}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-12 z-40 mr-4 w-48 rounded border border-gray-300 bg-white shadow">
              <div className="p-4">
                <p className="mb-2 text-sm text-gray-600">{email}</p>
                <Signout  />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* user details  */}
    </div>
  );
}

export default TopBar;
