"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as DarkReader from "darkreader";

let localStorage;
if (typeof window !== "undefined") {
  localStorage = window.localStorage;
}

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

  useEffect(() => {
    // This effect only runs in the browser → localStorage exists here
    setIsMounted(true);

    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setIsDarkMode(true);
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      DarkReader.disable();
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Safe: this function only runs after mount (user click)
    localStorage.setItem("darkMode", newMode);

    if (newMode) {
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      DarkReader.disable();
    }
  };

  // Don't render anything until we're sure we're in the browser
  // This prevents hydration errors and stops ESLint complaining
  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <Image src="/sun.svg" alt="Light mode" width={24} height={24} />
      ) : (
        <Image src="/moon.svg" alt="Dark mode" width={24} height={24} />
      )}
    </button>
  );
}
