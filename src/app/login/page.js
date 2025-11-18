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

  // --- NEW STATE FOR TERMS OF SERVICE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

          {/* UPDATED: Button disabled if terms not accepted */}
          <button
            onClick={handleSignUp}
            disabled={loading || !termsAccepted}
            className="w-full bg-[#c45517] text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "..." : "Sign Up"}
          </button>
        </div>
      </form>

      {/* NEW: Checkbox for Terms of Service */}
      <div className="mt-4 text-sm text-gray-500">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="terms">
          I agree to the{" "}
          <button
            type="button" // Prevent form submission
            onClick={() => setIsModalOpen(true)}
            className="underline hover:text-blue-600"
          >
            Terms of Service
          </button>
          .
        </label>
      </div>

      <p className="text-red-400">{message}</p>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-[#0064B1]">
              Terms of Service & Data Usage
            </h2>
            <div className="text-left space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Do you store my Spotify password?
                </h3>
                <p>
                  No. We **never** see, handle, or store your Spotify password.
                  All authentication is handled securely by Spotify&apos;s
                  official login page.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  What Spotify data will be accessed?
                </h3>
                <p>
                  To provide your personal stats, we request permission to
                  access:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>
                    Your basic Spotify profile information (username and email).
                  </li>
                  <li>
                    Your recently played tracks to build your listening history.
                  </li>
                  <li>Your top artists to determine genre preferences.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  How often is my data retrieved?
                </h3>
                <p>
                  To keep your stats up-to-date, our app automatically syncs
                  your latest listening history from Spotify each time you open
                  or refresh the dashboard. We do not track your listening in
                  the background.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}