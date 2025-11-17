"use client";

import React, { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";

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
} from "recharts";

/* eslint react/prop-types: 0 */

function TopArtistsChart({ data, title }) {
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
            tick={{ fontSize: 12 }}
            width={80}
            interval={0}
          />
          <Tooltip cursor={{ fill: "rgba(238, 238, 238, 0.5)" }} />
          <Bar dataKey="count" fill="#0064B1" />
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

function TopSongsBarChart({ data, title }) {
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
            tick={{ fontSize: 12 }}
            width={80}
            interval={0}
          />
          <Tooltip cursor={{ fill: "rgba(238, 238, 238, 0.5)" }} />
          <Bar dataKey="count" fill="#C45517" />
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
            <span className="font-bold text-gray-800">{song.name}</span> by{" "}
            {song.artist}
            <span className="text-sm text-gray-500"> ({song.count} plays)</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TabButton({ label, activeTab, onClick }) {
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
}

export default function CampusStats() {
  const [fullTopArtists, setFullTopArtists] = useState([]);
  const [fullTopSongs, setFullTopSongs] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("topartists");
  const ARTIST_DEFAULT_LIMIT = 10;
  const SONG_DEFAULT_LIMIT = 10;
  const [artistLimit, setArtistLimit] = useState(ARTIST_DEFAULT_LIMIT);
  const [songLimit, setSongLimit] = useState(SONG_DEFAULT_LIMIT);

  useEffect(() => {
    async function fetchCampusData() {
      setAnalyticsLoading(true);
      const { data: plays, error: playsError } = await supabase
        .from("plays")
        .select("artist_name, track_name, artist_ids"); // No user filtering!
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

      setAnalyticsLoading(false);
    }
    fetchCampusData();
  }, []);

  const visibleArtists = fullTopArtists.slice(0, artistLimit);
  const visibleSongs = fullTopSongs.slice(0, songLimit);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <main className="text-gray-800 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Campus Stats</h2>
            <p className="text-gray-500 mt-1">
              Spotify plays and analytics for everyone in your campus.
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
            </nav>
          </div>
          {analyticsLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {activeTab === "topartists" && (
                <div>
                  <TopArtistsChart
                    data={visibleArtists}
                    title="Campus Top Artists"
                  />
                  <TopArtistsList
                    data={visibleArtists}
                    title="Campus Top Artists"
                  />
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
                  <TopSongsBarChart
                    data={visibleSongs}
                    title="Campus Top Songs"
                  />
                  <TopSongsList data={visibleSongs} title="Campus Top Songs" />
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
