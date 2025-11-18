'use client';

import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from "next/navigation";
import Image from 'next/image'; // <--- THIS WAS MISSING
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from "recharts";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- Reusable Chart/List Components ---
function TopArtistsChart({ data, title }) {
  const [expandedText, setExpandedText] = useState(null);
  {expandedText && (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
      onClick={() => setExpandedText(null)}
    >
      {expandedText}
    </div>
  )}
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 p-4">No artist data available.</p>
    );
  const chartHeight = data.length * 40 + 50;
  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />

          
          <YAxis
          type="category"
          dataKey="name"
          width={10}     // tiny width; labels hidden
          tick={false}   // hide broken labels
          />
          <Tooltip cursor={{ fill: "rgba(238, 238, 238, 0.5)" }} />
          <Bar dataKey="count" fill="#0064B1">
          
          <LabelList 
          dataKey="name"
          position="insideLeft"
          className="custom-bar-label"
          content={(props) => {
            const { x, y, width, value } = props;

            const truncated =
              value.length > 18 ? value.substring(0, 18) + "..." : value;

            return (
              <text
                x={x + 5}
                y={y + 15}
                fill="#fff"
                fontSize={16}
                fontWeight="bold"          
                textAnchor="start"
                style={{ cursor: "pointer" }}
                onClick={() => setExpandedText(value)}
              >
                {truncated}
              </text>
            );
          }}
          />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopArtistsList({ data, title }) {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 p-4">No artist data available.</p>
    );
  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ol className="list-decimal list-inside space-y-3">
        {data.map((artist) => (
          <li key={artist.name} className="text-gray-700">
            <span className="font-bold text-gray-800">{artist.name}</span>
            <span className="text-sm text-gray-500">
              {" "}
              ({artist.count} plays)
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function formatGenre(genreName) {
  const acronyms = ["edm", "r&b", "ccm", "opm", "vbs", "lds"];
  if (acronyms.includes(genreName.toLowerCase())) {
    return genreName.toUpperCase();
  }
  return genreName.replace(/(^|\s|-)\S/g, (match) => match.toUpperCase());
}

function TopGenresChart({ data, title, onGenreSelect }) {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 p-4">No genre data available.</p>
    );

  const formattedData = data.map((genre) => ({
    ...genre,
    displayName: formatGenre(genre.name),
  }));

  const chartHeight = 250 + data.length * 20;
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4560",
    "#775DD0",
    "#546E7A",
    "#26a69a",
    "#D10CE8",
  ];

  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={formattedData}
            dataKey="count"
            nameKey="displayName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            onClick={(payload) => onGenreSelect(payload.name)}
            label={(entry) => entry.displayName}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopGenresBarChart({ data, title, onGenreSelect }) {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 p-4">No genre data available.</p>
    );

  const formattedData = data.map((genre) => ({
    ...genre,
    displayName: formatGenre(genre.name),
  }));

  const chartHeight = data.length * 40 + 50;

  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="displayName"
            tick={{ fontSize: 12 }}
            width={80}
            interval={0}
          />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#0064B1"
            onClick={(payload) => onGenreSelect(payload.name)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopGenresList({ data, title, onGenreSelect }) {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 p-4">No genre data available.</p>
    );

  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ol className="list-decimal list-inside space-y-2">
        {data.map((genre) => (
          <li
            key={genre.name}
            onClick={() => onGenreSelect(genre.name)}
            className="text-gray-700 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <span className="font-bold text-gray-800">
              {formatGenre(genre.name)}
            </span>
            <span className="text-sm text-gray-500">
              {" "}
              ({genre.count} instances)
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}



function TopSongsBarChart({ data, title }) {
  const [expandedText, setExpandedText] = useState(null);
  {expandedText && (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
      onClick={() => setExpandedText(null)}
    >
      {expandedText}
    </div>
  )}

  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 p-4">No song data available.</p>
    );
  const chartHeight = data.length * 40 + 50;
  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis
          type="category"
          dataKey="name"
          width={10}     // tiny width; labels hidden
          tick={false}   // hide broken labels
          />
          <Tooltip cursor={{ fill: "rgba(238, 238, 238, 0.5)" }} />
          <Bar dataKey="count" fill="#C45517" >
          <LabelList 
          dataKey="name"
          position="insideLeft"
          className="custom-bar-label"
          content={(props) => {
            const { x, y, width, value } = props;

            const truncated =
              value.length > 18 ? value.substring(0, 18) + "..." : value;

            return (
              <text
                x={x + 5}
                y={y + 15}
                fill="#fff"
                fontSize={16}
                fontWeight="bold"          
                textAnchor="start"
                style={{ cursor: "pointer" }}
                onClick={() => setExpandedText(value)}
              >
                {truncated}
              </text>
            );
          }}
          />
          </Bar>
          
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopSongsList({ data, title }) {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 p-4">No song data available.</p>
    );
  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ol className="list-decimal list-inside space-y-3">
        {data.map((song) => (
          <li key={`${song.name}-${song.artist}`} className="text-gray-700">
            {" "}
            <span className="font-bold text-gray-800">{song.name}</span> by{" "}
            {song.artist}{" "}
            <span className="text-sm text-gray-500"> ({song.count} plays)</span>{" "}
          </li>
        ))}
      </ol>
    </div>
  );
}

function GenreSongsList({ songs, genre, onClear }) {
  return (
    <div className="mt-8 bg-white border rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          Top Songs for <span className="text-[#0064b1]">{genre}</span>
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          × Clear
        </button>
      </div>
      {songs.length > 0 ? (
        <ol className="list-decimal list-inside space-y-2">
          {songs.map((song) => (
            <li key={`${song.name}-${song.artist}`}>
              {" "}
              <span className="font-semibold">{song.name}</span> by{" "}
              {song.artist}{" "}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500">
          No specific songs found for this genre in your top tracks.
        </p>
      )}
    </div>
  );
}

const TabButton = ({ label, activeTab, onClick }) => {
  const isActive = activeTab === label.toLowerCase().replace(" ", "");

  let activeColorClasses = "text-[#0064B1] border-[#0064B1]";
  if (label === "Top Songs") {
    activeColorClasses = "text-[#C45517] border-[#C45517]";
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-lg font-semibold border-b-4 transition duration-300 ${
        isActive
          ? activeColorClasses
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

const CustomYAxisTick = ({ x, y, payload, onClick }) => {
  const text = payload.value;
  const truncated =
    text.length > 18 ? text.substring(0, 18) + "..." : text;

  return (
    <text
      x={x + 10}       // Slight padding only
      y={y + 5}
      textAnchor="start"  // Show label to the right of axis
      fontSize={12}
      fill="#333"
      style={{ cursor: "pointer" }}
      onClick={() => onClick(text)}
    >
      {truncated}
    </text>
  );
};





export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Data state
  const [fullTopArtists, setFullTopArtists] = useState([]);
  const [fullTopSongs, setFullTopSongs] = useState([]);
  const [fullTopGenres, setFullTopGenres] = useState([]);
  const [artistGenreMap, setArtistGenreMap] = useState(new Map());
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState("topartists");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [songsForGenre, setSongsForGenre] = useState([]);
  
  const [artistViewType, setArtistViewType] = useState("bar");
  const [songViewType, setSongViewType] = useState("bar");
  const [genreViewType, setGenreViewType] = useState("pie");

  const ARTIST_DEFAULT_LIMIT = 10;
  const SONG_DEFAULT_LIMIT = 10;
  const GENRE_DEFAULT_LIMIT = 5;
  const [artistLimit, setArtistLimit] = useState(ARTIST_DEFAULT_LIMIT);
  const [songLimit, setSongLimit] = useState(SONG_DEFAULT_LIMIT);
  const [genreLimit, setGenreLimit] = useState(GENRE_DEFAULT_LIMIT);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchAnalyticsData() {
    if (!session) return;
    setAnalyticsLoading(true);
    const { data: plays, error: playsError } = await supabase
      .from("plays")
      .select("artist_name, track_name, artist_ids")
      .eq("user_id", session.user.id);
    if (playsError) {
      console.error("Error fetching plays:", playsError);
      setAnalyticsLoading(false);
      return;
    }

    const artistCounts = {};
    plays.forEach((p) =>
      p.artist_name
        .split(", ")
        .filter((a) => a)
        .forEach((a) => (artistCounts[a] = (artistCounts[a] || 0) + 1))
    );
    const sortedArtists = Object.entries(artistCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    setFullTopArtists(sortedArtists);

    const songCounts = {};
    plays.forEach((p) => {
      const key = `${p.track_name}||${p.artist_name}`;
      songCounts[key] = (songCounts[key] || 0) + 1;
    });
    const sortedSongs = Object.entries(songCounts)
      .map(([key, count]) => {
        const [name, artist] = key.split("||");
        return { name, artist, count };
      })
      .sort((a, b) => b.count - a.count);
    setFullTopSongs(sortedSongs);

    const uniqueArtistIds = [
      ...new Set(
        plays.flatMap((p) => (p.artist_ids ? p.artist_ids.split(",") : []))
      ),
    ];
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    const spotifyToken = currentSession?.provider_token;
    if (spotifyToken && uniqueArtistIds.length > 0) {
      try {
        const tempArtistGenreMap = new Map();
        const artistChunks = [];
        for (let i = 0; i < uniqueArtistIds.length; i += 50) {
          artistChunks.push(uniqueArtistIds.slice(i, i + 50));
        }

        for (const chunk of artistChunks) {
          const artistIdsParam = chunk.join(",");
          // --- Corrected Spotify API URL ---
          const artistResponse = await fetch(
            `https://api.spotify.com/v1/artists?ids=${artistIdsParam}`,
            { headers: { Authorization: `Bearer ${spotifyToken}` } }
          );
          const artistDetails = await artistResponse.json();
          if (artistDetails && artistDetails.artists) {
            artistDetails.artists.forEach((artist) => {
              if (artist) tempArtistGenreMap.set(artist.name, artist.genres);
            });
          }
        }
        setArtistGenreMap(tempArtistGenreMap);

        const genreCounts = {};
        tempArtistGenreMap.forEach((genres) =>
          genres.forEach(
            (genre) => (genreCounts[genre] = (genreCounts[genre] || 0) + 1)
          )
        );
        const sortedGenres = Object.entries(genreCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        setFullTopGenres(sortedGenres);
      } catch (e) {
        console.error("Failed to fetch genres from Spotify:", e);
      }
    }
    setAnalyticsLoading(false);
  }

  const handleGenreSelect = (genreName) => {
    if (!genreName) return;
    if (selectedGenre === genreName) {
      setSelectedGenre(null);
      setSongsForGenre([]);
      return;
    }
    setSelectedGenre(genreName);
    const filteredSongs = fullTopSongs.filter((song) => {
      const artists = song.artist.split(", ");
      return artists.some((artistName) => {
        const genres = artistGenreMap.get(artistName);
        return genres && genres.includes(genreName);
      });
    });
    setSongsForGenre(filteredSongs.slice(0, 10));
  };

  async function syncRecentPlays() {
    setMessage("Syncing with Spotify...");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const spotifyToken = session?.provider_token;
    if (!spotifyToken) {
      setMessage("Error: Spotify token not found.");
      return;
    }

    try {
      const sinceTimestamp = new Date("2025-09-01T00:00:00").getTime();
      // --- Corrected Spotify API URL ---
      const apiUrl = `https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${sinceTimestamp}`;
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch from Spotify");
      const plays = await response.json();

      if (!plays.items || plays.items.length === 0) {
        setMessage("");
        return;
      }

      const rows = plays.items.map((item) => ({
        user_id: session.user.id,
        track_name: item.track.name,
        artist_name: item.track.artists.map((a) => a.name).join(", "),
        artist_ids: item.track.artists.map((a) => a.id).join(","),
        played_at: item.played_at,
      }));
      await supabase
        .from("plays")
        .upsert(rows, { onConflict: "user_id, played_at" });
      setMessage("Sync complete!");
    } catch (e) {
      setMessage(`Error: ${e.message}`);
      console.error(e);
    }
  }

  useEffect(() => {
    async function initializeDashboard() {
      if (session) {
        await syncRecentPlays();
        await fetchAnalyticsData();
      }
    }
    initializeDashboard();
  }, [session]);

  async function handleSignIn(event) {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    setLoading(false);
  }

  async function handleSignUp(event) {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the confirmation link!");
    }
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const visibleArtists = fullTopArtists.slice(0, artistLimit);
  const visibleSongs = fullTopSongs.slice(0, songLimit);
  const visibleGenres = fullTopGenres.slice(0, genreLimit);

  if (!session) {
    return (
      <>
        <main className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-10 text-center">
          <Image
            src="/Mavbeats.svg"
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
                disabled={loading || !termsAccepted}
                className="w-full bg-[#c45517] text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition duration-300 disabled:bg-gray-400"
              >
                {loading ? "..." : "Sign Up"}
              </button>
            </div>
          </form>
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
                onClick={() => setIsModalOpen(true)}
                className="underline hover:text-blue-600"
              >
                Terms of Service
              </button>
              .
            </label>
          </div>
          <p
            className={`mt-4 text-sm font-semibold ${
              message.startsWith("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        </main>

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
                    No. We **never** see, handle, or store your Spotify
                    password. All authentication is handled securely by
                    Spotify&apos;s official login page.
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
                      Your basic Spotify profile information (username and
                      email).
                    </li>
                    <li>
                      Your recently played tracks to build your listening
                      history.
                    </li>
                    <li>
                      Your top artists to determine genre preferences.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    How often is my data retrieved?
                  </h3>
                  <p>
                    To keep your stats up-to-date, our app automatically syncs
                    your latest listening history from Spotify each time you
                    open or refresh the dashboard. We do not track your
                    listening in the background.
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
      </>
    );
  }

  if (!session.user.identities?.some((id) => id.provider === "spotify")) {
    return (
      <main className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Almost there, {session.user.email}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Please connect your Spotify account to continue.
        </p>
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "spotify",
              options: {
                scopes:
                  "user-read-recently-played user-top-read user-read-email",
              },
            })
          }
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

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar user={session.user} onSignOut={signOut} />
      <main className="text-gray-800 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Your Personal Stats</h2>
            <p className="text-gray-500 mt-1">
              Your listening history, updated automatically when you visit.
            </p>
          </div>

          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex gap-6" aria-label="Tabs">
              <TabButton
                label="Top Artists"
                activeTab={activeTab}
                onClick={() => setActiveTab("topartists")}
              />
              <TabButton
                label="Top Songs"
                activeTab={activeTab}
                onClick={() => setActiveTab("topsongs")}
              />
              <TabButton
                label="Top Genres"
                activeTab={activeTab}
                onClick={() => setActiveTab("topgenres")}
              />
            </nav>
          </div>

          {analyticsLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {activeTab === "topartists" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <select
                      value={artistViewType}
                      onChange={(e) => setArtistViewType(e.target.value)}
                      className="p-2 border rounded-md bg-white shadow-sm"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                  {artistViewType === "bar" && (
                    <TopArtistsChart
                      data={visibleArtists}
                      title="Your Top Artists"
                    />
                  )}
                  {artistViewType === "list" && (
                    <TopArtistsList
                      data={visibleArtists}
                      title="Your Top Artists"
                    />
                  )}
                  <div className="flex gap-4 justify-center">
                    {artistLimit > ARTIST_DEFAULT_LIMIT && (
                      <button
                        onClick={() =>
                          setArtistLimit((prev) =>
                            Math.max(ARTIST_DEFAULT_LIMIT, prev - 10)
                          )
                        }
                        className="w-full text-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                      >
                        Show Less
                      </button>
                    )}
                    {fullTopArtists.length > artistLimit && (
                      <button
                        onClick={() => setArtistLimit((prev) => prev + 10)}
                        className="w-full text-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                      >
                        Show More
                      </button>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "topsongs" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <select
                      value={songViewType}
                      onChange={(e) => setSongViewType(e.target.value)}
                      className="p-2 border rounded-md bg-white shadow-sm"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                  {songViewType === "bar" && (
                    <TopSongsBarChart
                      data={visibleSongs}
                      title="Your Top Songs"
                    />
                  )}
                  {songViewType === "list" && (
                    <TopSongsList data={visibleSongs} title="Your Top Songs" />
                  )}
                  <div className="flex gap-4 justify-center">
                    {songLimit > SONG_DEFAULT_LIMIT && (
                      <button
                        onClick={() =>
                          setSongLimit((prev) =>
                            Math.max(SONG_DEFAULT_LIMIT, prev - 10)
                          )
                        }
                        className="w-full text-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                      >
                        Show Less
                      </button>
                    )}
                    {fullTopSongs.length > songLimit && (
                      <button
                        onClick={() => setSongLimit((prev) => prev + 10)}
                        className="w-full text-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                      >
                        Show More
                      </button>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "topgenres" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <select
                      value={genreViewType}
                      onChange={(e) => setGenreViewType(e.target.value)}
                      className="p-2 border rounded-md bg-white shadow-sm"
                    >
                      <option value="pie">Pie Chart</option>
                      <option value="bar">Bar Chart</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                  {genreViewType === "pie" && (
                    <TopGenresChart
                      data={visibleGenres}
                      title="Your Top Genres"
                      onGenreSelect={handleGenreSelect}
                    />
                  )}
                  {genreViewType === "bar" && (
                    <TopGenresBarChart
                      data={visibleGenres}
                      title="Your Top Genres"
                      onGenreSelect={handleGenreSelect}
                    />
                  )}
                  {genreViewType === "list" && (
                    <TopGenresList
                      data={visibleGenres}
                      title="Your Top Genres"
                      onGenreSelect={handleGenreSelect}
                    />
                  )}
                  <div className="flex gap-4 justify-center">
                    {genreLimit > GENRE_DEFAULT_LIMIT && (
                      <button
                        onClick={() =>
                          setGenreLimit((prev) =>
                            Math.max(GENRE_DEFAULT_LIMIT, prev - 5)
                          )
                        }
                        className="w-full text-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                      >
                        Show Less
                      </button>
                    )}
                    {fullTopGenres.length > genreLimit && (
                      <button
                        onClick={() => setGenreLimit((prev) => prev + 5)}
                        className="w-full text-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                      >
                        Show More
                      </button>
                    )}
                  </div>
                  {selectedGenre ? (
                    <GenreSongsList
                      songs={songsForGenre}
                      genre={selectedGenre}
                      onClear={() => setSelectedGenre(null)}
                    />
                  ) : (
                    <div className="mt-8 bg-white border rounded-xl shadow p-6 text-center text-gray-500">
                      <p>
                        Click a genre above to see your top songs from that
                        category.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}