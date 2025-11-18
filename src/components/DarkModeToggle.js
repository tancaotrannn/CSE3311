"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as DarkReader from "darkreader";

/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("darkMode");
      if (saved === "true") {
        setIsDarkMode(true);
        DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("darkMode", String(newMode));
    }

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
        alt="Toggle Dark Mode"
        width={24}
        height={24}
      />
    </button>
  );
}
