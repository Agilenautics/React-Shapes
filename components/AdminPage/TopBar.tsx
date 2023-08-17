import { useEffect, useState } from "react";
import Signout from "../Authentication/Signout/Signout";
//import { auth } from "../../auth";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { UrlObject } from "url";
import { BsFillSunFill } from 'react-icons/bs'
import { useDarkMode } from "../Sidebar/DarkModeToggleButton";

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




function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, setTheme] = useDarkMode();

  var x = typeof window !== "undefined" ? localStorage.theme : "light";
  const [isDark, setIsDark] = useState(x === "dark");
  function toggleDarkModeButton(e: boolean | any) {
    e ? setTheme("dark") : setTheme("light");
    setIsDark(e);
  }

  console.log(x)



  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [email, setEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email)
      }
    })
  }, [auth]);

  const navigate = (path: string | UrlObject) => {
    router.push(path)
  }

  // dark mode



  return (
    // <div className="flex sticky top-0 right-0 left-0 h-14 items-center border-b border-gray-300 text-xl dark:text-white">
    //   <a className="ml-6 font-bold text-gray-400">FLOWCHART</a>
    //   <div className="flex flex-grow items-center justify-center space-x-8 text-lg">
    //     <a className="hover:text-sky-700">Projects</a>
    //     <Link href="/Policies">Policies</Link>
    //   </div>
    //   <div className="relative">
    //     <button
    //       className="mr-12 flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white"
    //       onClick={toggleDropdown}
    //     >
    //       {getInitials(email)}
    //     </button>
    //     {dropdownOpen && (
    //       <div className="absolute z-40 right-0 top-12 mr-4 w-48 rounded border border-gray-300 bg-white shadow">
    //         <div className="p-4">
    //           <p className="mb-2 text-sm text-gray-600">{email}</p>
    //           <Signout />
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="sticky font-sans  top-0 right-0 left-0 shadow bg-white z-50 p-2 px-12 flex justify-between dark:bg-slate-600">
      {/* logo  */}
      <div className="">
        <span className=" font-bold text-2xl text-gray-400">
          <Link href={`/projects`}>FLOWCHART</Link>
        </span>
      </div>
      {/* links */}
      <div className="flex gap-8 text-[1rem] font-normal justify-around  items-center dark:text-white ">
        <div className=" duration-300  hover:bg-slate-100 hover:text-slate-500 py-1 px-2 rounded transition">
          <Link href='/projects'>projects</Link>
        </div>
        <div className="duration-300  hover:bg-slate-100 hover:text-slate-500 py-1 px-2 rounded transition">
          <Link href='/users'>users</Link>
        </div>
        <div className="duration-300  hover:bg-slate-100 hover:text-slate-500 py-1 px-2 rounded transition">
          <Link href='/Policies'>policies</Link>
        </div>
        <div className=" text-slate-500 border border-1 rounded-full p-1 cursor-pointer ">
          <div className="relative">
            <input
              type="checkbox"
              // className="sr-only"
              checked={isDark}
              onChange={(e) => toggleDarkModeButton(e.target.checked)}
            />
            {/* <div className="block h-6 font-bold  w-16 rounded-full bg-gray-700"></div> */}
            <div className={`absolute w-5  h-5 bg-white border ${isDark ? 'translate-x-full left-[22px]' : "left-[2px]"}  top-[2.5px] duration-300 ease-in rounded-full `}> {isDark ? <BsFillSunFill className="text-lg p-[2px]" /> : <BsFillSunFill className="text-lg p-[2px]" />} </div>
          </div>
        </div>
        <div className="relative">
          <button
            className="mr-12 flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white"
            onClick={toggleDropdown}
          >
            {getInitials(email)}
          </button>
          {dropdownOpen && (
            <div className="absolute z-40 right-0 top-12 mr-4 w-48 rounded border border-gray-300 bg-white shadow">
              <div className="p-4">
                <p className="mb-2 text-sm text-gray-600">{email}</p>
                <Signout />
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
