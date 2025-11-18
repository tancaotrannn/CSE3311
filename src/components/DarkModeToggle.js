"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as DarkReader from "darkreader";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize dark mode state from localStorage on mount
  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === "undefined") return;
    
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
    
    if (savedMode) {
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10
      });
    }
    
    setIsLoading(false);
  }, []);

  const toggleDarkMode = () => {
    // Check if we're on the client side
    if (typeof window === "undefined") return;
    
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());

    if (newMode) {
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10
      });
    } else {
      DarkReader.disable();
    }
  };

  if (isLoading) return null;

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
