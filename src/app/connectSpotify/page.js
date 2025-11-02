"use client";
import React from "react";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function ConnectSpotifyPage() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  // Fetch session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setSession(session);
      }
    });
  }, [router]);

  // If already connected to Spotify, go to dashboard
  useEffect(() => {
    if (
      session &&
      session.user.identities?.some((id) => id.provider === "spotify")
    ) {
      router.replace("/");
    }
  }, [session, router]);

  // Handle connect button
  function handleConnectSpotify() {
    supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        scopes: "user-read-recently-played user-top-read user-read-email",
      },
    });
  }

  // Handle sign out
  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Almost there, {session.user.email}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Please connect your Spotify account to continue.
      </p>
      <button
        onClick={handleConnectSpotify}
        className="bg-[#1DB954] text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition duration-300"
      >
        Connect Spotify
      </button>
      <button
        onClick={signOut}
        className="text-sm text-gray-500 mt-8 hover:underline"
      >
        Sign Out
      </button>
    </main>
  );
}
