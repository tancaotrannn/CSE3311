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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function getRecentPlays() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.provider_token) {
      console.error('Error getting session or provider token');
      return;
    }

    const spotifyToken = data.session.provider_token;

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Spotify API failed with status: ${response.status}`);
      }

      const plays = await response.json();
      setTracks(plays.items || []);
    } catch (e) {
      console.error('Failed to fetch recent plays:', e);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setTracks([]);
  }

  // --- LOGIN VIEW ---
  if (!session) {
    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">MavBeats</h1>
        <p className="text-lg text-gray-600 mb-8">Log in to see your personal stats and what's trending on campus.</p>
        <button 
          onClick={() => supabase.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
              scopes: 'user-read-recently-played',
            },
          })} 
          // UTA Orange Button
          className="bg-[#c45517] text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition duration-300"
        >
          Sign In with Spotify
        </button>
      </main>
    );
  }

  // --- LOGGED-IN VIEW ---
  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Welcome, {session.user.user_metadata.full_name}!</h1>
          <button 
            onClick={signOut} 
            className="bg-[#c45517] text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Sign Out
          </button>
        </div>
        
        <button 
          onClick={getRecentPlays} 
          // UTA Blue Button
          className="bg-[#0d6cb5] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-300 mb-8"
        >
          Fetch My 20 Recent Tracks
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