import { useEffect, useState } from "react";
import {BsSun,BsMoonStars} from 'react-icons/bs'

/**
 * This custom hook sets the theme to the value of the theme cookie, and then it sets the theme to the opposite of
 * the current theme when the user clicks the toggle
 * @returns An array with two elements.
 */
function useDarkMode() {
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
    <div className=" ml-4">
      <label className="flex cursor-pointer items-center ">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isDark}
            onChange={(e) => toggleDarkModeButton(e.target.checked)}
          />
          <div className="block h-6 font-bold  w-16 rounded-full bg-gray-700"></div>
          <div className={`absolute w-5  h-5 bg-white border ${isDark?'translate-x-full left-[22px]':"left-[2px]"}  top-[2.5px] duration-300 ease-in rounded-full `}> {isDark?<BsMoonStars  className="text-lg p-[2px]" />:<BsSun className="text-lg p-[2px]" />} </div>
        </div>
        <div className="ml-3 transition dark:text-gray-50">{isDark?"Dark Mode":"Light Mode"}</div>
      </label>
    </div>
  );
}

export default DarkModeToggleButton;
