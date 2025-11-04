"use client";

import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState, useRef } from "react";

type LeaderboardUser = {
  rank: number;
  id: string;
  name: string;
  skills: number;
  points: number;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { userdata } = useAppContext();

  const scrollRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        setLeaderboard(data);

        // ✅ Find current user's rank using userdata.id
        if (userdata?.id) {
          const current = data.find((u: any) => u.id === userdata.id);
          if (current) setUserRank(current.rank);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userdata?.id]);

  // ✅ Auto-scroll to user's row once leaderboard & rank are loaded
  useEffect(() => {
    if (scrollRef.current && userRank) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [userRank]);

  if (loading) {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-purple-400 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
      </div>
      <p className="text-lg font-semibold animate-pulse">Loading leaderboard...</p>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-b mt-20 from-[#0f0f11] to-[#1a1a1d] text-gray-100 px-6 py-10">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold  p-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 tracking-tight">
          SkillX Leaderboard
        </h1>
        {userRank && (
          <div className="text-sm bg-purple-700/40 text-purple-200 px-5 py-2 rounded-xl border border-purple-600 shadow-lg">
            Your Current Rank: #{userRank}
          </div>
        )}
      </header>

      {/* USER STATS */}
      <section className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1b1b1f] rounded-2xl p-5 border border-purple-700/50 text-center shadow-md shadow-purple-900/30">
          <p className="text-gray-400 text-sm">Your Rank</p>
          <h2 className="text-3xl font-semibold text-white mt-1">
            #{userRank ?? "--"}
          </h2>
        </div>

        <div className="bg-[#1b1b1f] rounded-2xl p-5 border border-purple-700/50 text-center shadow-md shadow-purple-900/30">
          <p className="text-gray-400 text-sm">Your Points</p>
          <h2 className="text-3xl font-semibold text-white mt-1">
            {leaderboard.find((u) => u.id === userdata?.id)?.points ?? 0} pts
          </h2>
        </div>

        <div className="bg-[#1b1b1f] rounded-2xl p-5 border border-purple-700/50 text-center shadow-md shadow-purple-900/30">
          <p className="text-gray-400 text-sm">Top Rank</p>
          <h2 className="text-3xl font-semibold text-white mt-1">
            #{leaderboard[0]?.rank} — {leaderboard[0]?.points} pts
          </h2>
        </div>
      </section>

      {/* LEADERBOARD TABLE */}
      <div className="relative rounded-2xl border border-purple-700/40 backdrop-blur-sm bg-[#141416]/60 shadow-inner shadow-purple-900/30">
        <div className="overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-purple-700/60 scrollbar-track-transparent rounded-2xl">
          <table className="w-full text-left text-gray-200 border-collapse">
            <thead className="bg-[#19191b] text-gray-400 text-sm uppercase sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Skills</th>
                <th className="py-3 px-6">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => {
                const isCurrentUser = user.id === userdata?.id;
                return (
                  <tr
                    key={user.rank}
                    ref={isCurrentUser ? scrollRef : null}
                    className={`transition-all duration-300 ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-purple-600/40 to-pink-600/40 border-l-4 border-pink-500 font-semibold text-white scale-[1.01]"
                        : "hover:bg-[#1a1a1d]/60 hover:scale-[1.01]"
                    }`}
                  >
                    <td className="py-4 px-6">#{user.rank}</td>
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.skills}</td>
                    <td className="py-4 px-6">{user.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
