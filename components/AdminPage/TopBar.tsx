import { useEffect, useState } from "react";
import Signout from "../Authentication/Signout/Signout";
//import { auth } from "../../auth";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import { getAuth } from "firebase/auth";

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = auth.currentUser?.email || "";
    setEmail(userEmail);
  });

  return (
    <div className="flex h-14 items-center border-b border-gray-300 text-xl">
      <a className="ml-6 font-bold text-gray-400">FLOWCHART</a>
      <div className="flex flex-grow items-center justify-center space-x-8 text-lg">
        <a className="hover:text-sky-700">Projects</a>
        {/* <a className="hover:text-sky-700">Organizations</a> */}
        {/* <a className="text-sky-700">{userEmail}</a> */}
        <Link href="/Policies">Policies</Link>
      </div>
      {/* <div>
        <a className="text-sky-700">{userEmail}</a>
      </div> */}
      <div className="relative">
        <button
          className="mr-12 flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white"
          onClick={toggleDropdown}
        >
          {getInitials(email)}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-12 mr-4 w-48 rounded border border-gray-300 bg-white shadow">
            <div className="p-4">
              <p className="mb-2 text-sm text-gray-600">{email}</p>
              <Signout />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
