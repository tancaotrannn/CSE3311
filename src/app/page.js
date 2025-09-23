'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [session, setSession] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // This listener is the main security checkpoint for your application.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // --- THE DEFINITIVE SECURITY CHECK ---
      // This logic runs every time a user signs in or the page loads.
      if (session && !session.user.email_confirmed_at) {
        // 1. If a user has a session BUT their email is not yet confirmed...
        supabase.auth.signOut(); // 2. Immediately sign them out.
        // 3. Show a specific message telling them what to do.
        setMessage('You must confirm your email address before you can sign in. Please check your inbox.');
        setSession(null); // 4. Ensure the UI shows the login form.
      } else {
        // If the user is confirmed OR they are logged out (session is null), we can trust the session.
        setSession(session);
        if (session) {
            setMessage('');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignUp(event) {
    event.preventDefault();
    if (!email.endsWith('@mavs.uta.edu')) {
      setMessage('Error: You must sign up with a valid Maverick email address (@mavs.uta.edu).');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`
        }
      });
      if (error) throw error;
      if (data.user && data.user.identities?.length === 0) {
         setMessage('Error: This email is already in use. Please sign in instead.');
      } else {
        setMessage('Success! Please check your email for a confirmation link to complete your registration.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // The onAuthStateChange listener above will now handle the security check
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function getRecentPlays() {
    const { data: { session } } = await supabase.auth.getSession();
    const spotifyToken = session?.provider_token;
    if (!spotifyToken) {
      setMessage('Error: Could not find Spotify token. Please try signing out and in again.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      });
      if (!response.ok) throw new Error(`Spotify API failed with status: ${response.status}`);
      const plays = await response.json();
      setTracks(plays.items || []);
    } catch (e) {
      console.error('Failed to fetch recent plays:', e);
      setMessage(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setTracks([]);
    setMessage('');
  }

  // --- 1. LOGGED OUT VIEW ---
  if (!session) {
    return (
      <main className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-5xl font-bold text-[#0064b1] mb-4">MavBeats</h1>
        <p className="text-lg text-gray-600 mb-8">Sign in or create an account with your Maverick email.</p>
        <form className="w-full max-w-sm">
          <input type="email" placeholder="your.name@mavs.uta.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 text-gray-800" required/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 text-gray-800" required/>
          <div className="flex gap-4">
            <button onClick={handleSignIn} disabled={loading} className="w-full bg-[#0064b1] text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition duration-300 disabled:bg-gray-400">
              {loading ? '...' : 'Sign In'}
            </button>
            <button onClick={handleSignUp} disabled={loading} className="w-full bg-[#c45517] text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition duration-300 disabled:bg-gray-400">
              {loading ? '...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className={`mt-4 text-sm font-semibold ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
      </main>
    );
  }

  // Check if Spotify is linked to the user's account
  const isSpotifyLinked = session.user.identities?.some((identity) => identity.provider === 'spotify');

  // --- 2. LOGGED IN, BUT SPOTIFY NOT LINKED VIEW ---
  if (!isSpotifyLinked) {
    return (
      <main className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Almost there, {session.user.email}!</h1>
        <p className="text-lg text-gray-600 mb-8">Please connect your Spotify account to continue to MavBeats.</p>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'spotify', options: { scopes: 'user-read-recently-played' }})} className="bg-[#1DB954] text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition duration-300">
          Connect Spotify
        </button>
        <button onClick={signOut} className="text-sm text-gray-500 mt-8 hover:underline">Sign Out</button>
      </main>
    );
  }

  // --- 3. FULLY LOGGED IN AND LINKED VIEW (MAIN DASHBOARD) ---
  return (
    <main className="min-h-screen bg-[#ffffff] text-gray-800 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Welcome, {session.user.email}!</h1>
          <button onClick={signOut} className="bg-[#c45517] text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300">
            Sign Out
          </button>
        </div>
        <button onClick={getRecentPlays} disabled={loading} className="bg-[#0064B1] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-300 mb-8">
          {loading ? 'Fetching...' : 'Fetch My 20 Recent Tracks'}
        </button>
        <div>
          <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 mb-4">Recently Played:</h2>
          <ol className="list-decimal list-inside space-y-3">
            {tracks.map((item, index) => (
              <li key={item.played_at + index} className="text-gray-600">
                <span className="font-bold text-gray-800">{item.track.name}</span> by {item.track.artists.map(artist => artist.name).join(', ')}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}