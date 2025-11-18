"use client";

import React, { useState } from "react";
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

    // Now you can use localStorage anywhere in the file – ESLint is happy
    localStorage.setItem("darkMode", newMode.toString());

    if (newMode) {
      DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
    } else {
      DarkReader.disable();
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-200 transition duration-300"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <Image
        src="/sun.svg"
        alt="Dark Mode Toggle"
        width={24}
        height={24}
      />
    </button>
  );
}
