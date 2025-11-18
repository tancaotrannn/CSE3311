"use client";
import React from "react";
import { useState } from "react";
import supabase from "../utils/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 1. Sign in function
  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
      setLoading(false);
      return;
    }

    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    const hasSpotify = session?.user?.identities?.some(
      (id) => id.provider === "spotify"
    );

    setLoading(false);

    if (hasSpotify) {
      router.replace("/");
    } else {
      router.replace("/connectSpotify");
    }

    /* if (
      !data?.session?.user?.identities?.some((id) => id.provider === "spotify")
    ) {
      router.replace("/connectSpotify");
    } else {
      router.replace("/");
    }

    */
  }

  //2. Sign up function
  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signUp({
      email,
      password,
      // eslint-disable-next-line no-undef
      options: { emailRedirectTo: window.location.origin },
    });
    setMessage("Check your email for the confirmation link.");
    setLoading(false);
  }

  return (
    <main className="bg-[#ffffff] min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <Image
        src="/MavBeats.svg"
        alt="MavBeats Logo"
        width={360}
        height={360}
        className="mb-6"
      />
      <h1 className="text-5xl font-bold text-[#0064b1] mb-4">MavBeats</h1>
      <p className="text-lg text-gray-600 mb-8">
        Sign in or create an account with your Maverick email.
      </p>

      <form className="w-full max-w-sm">
        <input
          type="email"
          placeholder="your.name@mavs.uta.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 text-gray-800"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 text-gray-800"
          required
        />

        <div className="flex gap-4">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-[#0064b1] text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "..." : "Sign In"}
          </button>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-[#c45517] text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "..." : "Sign Up"}
          </button>
        </div>
      </form>
      <p className="text-red-400">{message}</p>
    </main>
  );
}
