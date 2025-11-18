// /components/Navbar.js
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* eslint react/prop-types: 0  */

export default function Navbar({ user, onSignOut }) {
  // Use the Spotify display name from user_metadata, or fall back to the email
  const displayName = user?.user_metadata?.name || user?.email;
  const pathname = usePathname();

  return (
    <div className="w-full bg-white shadow-md p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo and App Name */}
        <div className="flex items-center gap-4">
          <Image
            src="/Mavbeats.svg"
            alt="MavBeats Logo"
            width={160}
            height={160}
          />
          <h1 className="text-xl font-bold text-gray-800">MavBeats</h1>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="flex gap-8">
          <Link
            href="#"
            className={"text-gray-500 hover:text-[#0064b1] transition"}
          >
            Home
          </Link>
          <Link
            href="/"
            className={
              pathname === "/"
                ? "font-bold text-[#0064b1] border-b-2 border-[#0064b1]"
                : "text-gray-500 hover:text-[#0064b1] transition"
            }
          >
            Personal Stats
          </Link>

          <Link
            href="/campus-stats"
            className={
              pathname === "/campus-stats"
                ? "font-bold text-[#0064b1] border-b-2 border-[#0064b1]"
                : "text-gray-500 hover:text-[#0064b1] transition"
            }
          >
            Campus Stats
          </Link>
        </div>

        {/* Right Side: User and Sign Out */}
        <div className="flex items-center gap-4">
          {/* UPDATED: Displays the Spotify username */}
          <p className="text-sm text-gray-600 font-semibold text-right">
            {displayName}
          </p>
          <button
            onClick={onSignOut}
            className="bg-[#c45517] text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
