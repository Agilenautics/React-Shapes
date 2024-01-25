import React, { useEffect, useState } from "react";
import { BsSun, BsMoonStars } from 'react-icons/bs'

/**
 * This custom hook sets the theme to the value of the theme cookie, and then it sets the theme to the opposite of
 * the current theme when the user clicks the toggle
 * @returns An array with two elements.
 */
export function useDarkMode() {
  // ! Make the app read the proper theme from cookies
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.theme : "light"
  );
  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(colorTheme);
    root.classList.add(theme);

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme, colorTheme]);

  return [colorTheme, setTheme] as const;
}

/**
 * It's a React component that renders a toggle button that toggles between light and dark mode,
 * using the hook defined above
 * @returns A labelled dark mode toggle
 */
function DarkModeToggleButton() {
  const [, setTheme] = useDarkMode();
  var x = typeof window !== "undefined" ? localStorage.theme : "light";
  const [isDark, setIsDark] = useState(x === "dark");
  function toggleDarkModeButton(e: boolean) {
    e ? setTheme("dark") : setTheme("light");
    setIsDark(e);
  }
  return (
    // <div className="border p-[2px] rounded-full">
    //   <label className="flex cursor-pointer border items-center ">
    //     <div className="flex items-center -space-x-1" onClick={(e) => toggleDarkModeButton(!isDark)}>
    //       <input
    //         type="checkbox"
    //         // className="sr-only"
    //         checked={isDark}
    //         onChange={(e) => toggleDarkModeButton(e.target.checked)}
    //       />
    //       <span className={` w-5  h-5   top-[2.3px] duration-300 ease-in rounded-full `}> {isDark?<BsMoonStars  className="text-lg p-[2px]" />:<BsSun className="text-lg p-[2px]" />} </span>
    //     </div>
    //     <div className="ml-3 transition dark:text-gray-50">{isDark?"Dark Mode":"Light Mode"}</div>
    //   </label>
    // </div>

    <div onClick={(e) => toggleDarkModeButton(!isDark)} className="border border-orange-600 flex items-center p-[3px] dark:bg-slate-700 dark:border-none dark:p-1 rounded-full">
      <button className="duration-300 ease-in">
        {isDark ? <BsMoonStars className="text-lg "  data-test-id="DarkIcon"/> : <BsSun className="text-lg  text-orange-600 " data-test-id="LightIcon" />}
      </button>
    </div>
  );
}

export default DarkModeToggleButton;
