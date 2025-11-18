"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as DarkReader from "darkreader";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);  // ← Removed <boolean>
  const [isMounted, setIsMounted] = useState(false);    // ← Removed <boolean>

  useEffect(() => {
    setIsMounted(true);

    const saved = localStorage.getItem("darkMode");
    const prefersDark = saved === "true";
    setIsDarkMode(prefersDark);

    if (prefersDark) {
      DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
    }
  }, []);

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

  // Avoid hydration mismatch
  if (!isMounted) {
    return (
      <button className="p-2 rounded-lg opacity-0" disabled aria-hidden="true">
        <Image src="/sun.svg" alt="" width={24} height={24} />
      </button>
    );
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
