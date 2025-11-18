"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as DarkReader from "darkreader";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved preference only in the browser
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setIsDarkMode(true);
      DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
    }
  }, []);

  // Fixed arrow function (the only thing that was broken)
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));

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
