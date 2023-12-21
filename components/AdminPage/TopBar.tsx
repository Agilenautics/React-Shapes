import React, { useEffect, useState } from "react";
import Signout from "../Authentication/Signout/Signout";
//import { auth } from "../../auth";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaBars } from "react-icons/fa";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import DarkModeToggleButton from "../Sidebar/DarkModeToggleButton";
import { getInitials } from "./Users/Users";
import userStore from "./Users/userStore";
import { useTranslation } from "react-i18next";

const auth = getAuth();

interface Flag {
  toggleSideBar: () => void;
  flag: Boolean;
}

function TopBar({ toggleSideBar, flag }: Flag) {
  const { t, i18n } = useTranslation(); // useTranslation hook
  const [dropdownOpen, setDropdownOpen] = useState<Boolean>(false);
  const { userEmail } = userStore();
  const [locale, setLocale] = useState<string>(i18n.language); // Set initial locale

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale); // Update local state
    i18n.changeLanguage(newLocale); // Change language using i18n
  };

  return (
    <div className=" sticky left-0  right-0 top-0 z-10    flex  justify-between bg-white p-2  px-6 font-sans shadow-bottom  dark:bg-bgdarkcolor">
      {/* logo  */}
      <div className="flex gap-6">
        <button onClick={toggleSideBar} className="duration-200">
          {" "}
          {!flag && (
            <FaBars className="text-2xl text-slate-600 dark:text-white" />
          )}{" "}
        </button>
        <span
          className=" text-2xl font-bold text-gray-400"
          data-test-id="test-TextElement"
        >
          <Link href={`/projects`}>FLOWCHART</Link>
        </span>
      </div>
      {/* links */}
      <div className="flex items-center justify-around gap-8 text-[1rem]  font-normal dark:text-white ">
        <div className=" rounded  px-2 py-1 transition duration-300 hover:bg-slate-100 hover:text-slate-500">
          <Link href="/projects">{t("project")}</Link>
        </div>
        <div className="rounded  px-2 py-1 transition duration-300 hover:bg-slate-100 hover:text-slate-500">
          <Link href="/users">{t("user")}</Link>
        </div>
        <div className="rounded  px-2 py-1 transition duration-300 hover:bg-slate-100 hover:text-slate-500">
          <Link href="/Policies">{t("policies")}</Link>
        </div>

        <div>
          <DarkModeToggleButton />
        </div>
        <div className="relative">
          <button
            className="mr-12 flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 font-semibold text-white"
            onClick={toggleDropdown}
          >
            {getInitials(userEmail)}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-12 z-40 mr-4 w-48 rounded border border-gray-300 bg-white shadow">
              <div className="p-4">
                <p className="mb-2 text-sm text-gray-600">{userEmail}</p>
                <Signout />
              </div>
            </div>
          )}
        </div>
        <select
          value={locale}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="en">{t("English")}</option>
          <option value="fr">{t("French")}</option>
          <option value="ar">{t("Arabic")}</option>
        </select>
      </div>
      {/* user details  */}
    </div>
  );
}

export default TopBar;
