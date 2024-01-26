import React, { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useLocalStorage } from "usehooks-ts";

const SwitchMode = () => {
  //we store the theme in localStorage to preserve the state on next visit with an initial theme of dark.
  const [theme, setTheme] = useLocalStorage("theme", 'dark');

  //toggles the theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    theme === 'light' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  };

  //modify data-theme attribute on document.body when theme changes
  useEffect(() => {
    const body = document.body;
    // localStorage.theme = 'dark'
    body.setAttribute("data-theme", theme);
    theme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  }, [theme]);


  return (
    <button className="btn btn-circle" onClick={toggleTheme}>
      {theme === "dark" ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
      )}
    </button>
  );
};

export default SwitchMode;