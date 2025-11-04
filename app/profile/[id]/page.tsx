"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Trophy, Star, Award, Code, Flame } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ProfilePage() {
  const [ userdata, setUserdata ] = useState<any>({});
  const [open, setOpen] = useState(1);
  const [loading, setLoading] = useState(false);
  const {id} = useParams()
  const router  = useRouter()
useEffect(() => {
  if (!id) return;

  const controller = new AbortController();
  const signal = controller.signal;

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dataa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        signal,
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUserdata(data.user);  // ✅ State update triggers re-render
      } else {
        console.error("User not found:", data.error);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching user:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUser();

  return () => controller.abort();
}, [id]);

  const params = useParams();
  const [form, setForm] = useState({
    name: userdata?.name || "",
    bio: userdata?.bio || "",
    designation: userdata?.designation || "",
    profileImage:
      userdata?.profileImage ||
      `https://ui-avatars.com/api/?name=${userdata?.name}&background=ff5bd6&color=fff`,
  });

  if (!userdata)
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-200">
        Loading profile...
      </div>
    );
    //@ts-ignore
const avatar = userdata?.profileImage? userdata.profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(     userdata?.name || "User"    )}&background=ff5bd6&color=fff`;  const user = {    name: userdata.name,    handle: userdata.email,    avatar,    bio: userdata.bio || "Digital creator & software innovator.",    rating: (userdata.stars || 0).toFixed(1),    ranking: Math.floor(1000 / (userdata.points + 1)),    totalUsers: 5000,    skillsAdded: ["React", "Next.js", "Node.js", "TypeScript", "WebSockets"],    skillsLearned: Math.floor(userdata.points / 2),    contributions: Array.from({ length: 12 }, () =>      Math.floor(Math.random() * 10)    ),  };  const topPercent = Math.max(
    0,
    Math.round(((user.totalUsers - user.ranking + 1) / user.totalUsers) * 100)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/editprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userdata?.id||"",
          name: form.name,
          bio: form.bio,
          designation: form.designation,
          profileImage: form.profileImage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserdata(data.user);
        setOpen(1);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("Changes Accepted. Kindly refresh the page.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0b12] via-[#0b0910] to-[#120717] text-pink-400 p-6">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>

      {/* --- PROFILE VIEW --- */}
      {open ? (
        <div className="w-full max-w-8xl scale-[0.8] rounded-2xl bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] p-8 shadow-[0_0_40px_rgba(255,91,214,0.15)] relative">
          {/* Edit Button */}
          <button className="absolute top-6 translate-y-[50px] right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition cursor-pointer" onClick={ () => window.location.href = `/messages?id=${id||""}`}>
            Message
          </button>
          <button
            className="absolute top-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition cursor-pointer"
            onClick={() => setOpen(0)}
          >
            Edit Profile
          </button>

          {/* HEADER */}
          <header className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full ring-4 ring-[#ff5bd6]/40 object-cover shadow-xl"
              />
              <span className="absolute bottom-1 right-1 bg-[#ff5bd6] text-xs font-bold text-white px-2 py-0.5 rounded-full shadow-md">
                PRO
              </span>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-pink-100">{user.name}</h1>
              <p className="text-sm text-pink-300/70">{user.handle}</p>
              <p className="mt-2 text-sm text-pink-100/70 max-w-lg">
                {user.bio}
              </p>
            </div>
          </header>

          {/* STATS */}
          <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[rgba(255,255,255,0.015)] rounded-xl p-4">
            {[
              {
                label: "Stars",
                value: `${user.rating} ★`,
                icon: <Star className="w-4 h-4 inline" />,
                width: (parseFloat(user.rating) / 5) * 100,
                gradient: "linear-gradient(90deg,#ff5bd6,#c45cff)",
              },
              {
                label: "Ranking",
                value: `#${user.ranking}`,
                icon: <Award className="w-4 h-4 inline" />,
                width: topPercent,
                gradient: "linear-gradient(90deg,#ff8bd6,#8f63ff)",
              },
              {
                label: "Points",
                value: userdata.points,
                icon: <Flame className="w-4 h-4 inline" />,
                width: Math.min(100, userdata.points / 20),
                gradient: "linear-gradient(90deg,#ffb3da,#caa4ff)",
              },
              {
                label: "Skills Learned",
                value: user.skillsLearned,
                icon: <Code className="w-4 h-4 inline" />,
                width: Math.min(100, user.skillsLearned),
                gradient: "linear-gradient(90deg,#ffd3ee,#d3c4ff)",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xs text-pink-200/70 flex justify-center items-center gap-1">
                  {stat.icon} {stat.label}
                </p>
                <p className="text-lg font-semibold text-pink-100">
                  {stat.value}
                </p>
                <div className="mt-2 w-full bg-[rgba(255,255,255,0.03)] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${stat.width}%`, background: stat.gradient }}
                  />
                </div>
              </div>
            ))}
          </section>

          <div className="my-8 border-t border-[rgba(255,255,255,0.05)]"></div>

          {/* MAIN CONTENT */}
          <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skills */}
            <div className="bg-[rgba(255,255,255,0.02)] p-5 rounded-xl">
              <h3 className="text-pink-100 font-semibold mb-3">Added Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skillsAdded.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-[rgba(255,91,182,0.1)] border border-[rgba(255,91,182,0.2)] text-pink-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Community Ranking */}
            <div className="bg-gradient-to-br from-[#1a0915] to-[#2a0c1f] p-6 rounded-xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,91,214,0.15)] border border-[rgba(255,255,255,0.05)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,214,0.08),transparent)]" />
              <h3 className="text-pink-100 font-semibold mb-6 z-10">
                Community Ranking
              </h3>

              <div className="relative w-40 h-40 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.03)] ring-4 ring-[#ff5bd6]/30 shadow-inner overflow-hidden z-10">
                <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,#ff5bd6_0%,#c45cff_100%)] " />
                <div className="relative z-20 text-center bg-[#140714] rounded-full w-32 h-32 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-pink-100">
                    #{user.ranking}
                  </p>
                  <p className="text-xs text-pink-200/60">Top {topPercent}%</p>
                </div>
              </div>

              <p className="mt-5 text-sm text-pink-200/70 text-center z-10">
                Among{" "}
                <span className="font-semibold text-pink-100">
                  {user.totalUsers.toLocaleString()}
                </span>{" "}
                members
              </p>
            </div>

            {/* Activity */}
            <div className="bg-[rgba(255,255,255,0.02)] p-5 rounded-xl">
              <h3 className="text-pink-100 font-semibold mb-3">
                Activity Summary
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] py-2">
                  <span className="text-sm text-pink-200/70">Stars</span>
                  <span className="text-sm font-semibold text-pink-100">
                    {userdata.stars}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] py-2">
                  <span className="text-sm text-pink-200/70">Points</span>
                  <span className="text-sm font-semibold text-pink-100">
                    {userdata.points}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] py-2">
                  <span className="text-sm text-pink-200/70">Joined</span>
                  <span className="text-sm font-semibold text-pink-100">
                    {new Date(userdata.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Achievements */}
              <div className="mt-4">
                <h4 className="text-pink-100/80 font-medium">Achievements</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-pink-100 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Early Adopter
                  </span>
                  {userdata.stars >= 3 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-pink-100 flex items-center gap-1">
                      <Star className="w-3 h-3" /> 3★ Achiever
                    </span>
                  )}
                  {userdata.points >= 100 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-pink-100 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> 100+ Points
                    </span>
                  )}
                </div>
              </div>

              {/* Contribution Graph */}
              <div className="mt-5">
                <h4 className="text-pink-100/80 font-medium mb-2">
                  Monthly Activity
                </h4>
                <div className="flex gap-1">
                  {user.contributions.map((val, i) => (
                    <div
                      key={i}
                      className="w-4 h-10 rounded-sm bg-[#ff5bd6]/30"
                      style={{
                        opacity: 0.3 + val / 10,
                        transform: `scaleY(${0.5 + val / 10})`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* --- EDIT MODE --- */
        <div className="min-h-screen w-1/2 bg-[#0b0a0f] flex items-center justify-center px-4 sm:px-6">
          <div className="relative w-full max-w-2xl bg-[#121015] p-8 sm:p-10 rounded-2xl shadow-2xl text-white">
            {/* Close */}
            <button
              className="absolute top-4 right-6 text-gray-400 hover:text-pink-500 transition text-2xl cursor-pointer"
              onClick={() => setOpen(1)}
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Edit Your Profile
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#1a181f] border border-gray-700 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={form.bio}
                onChange={handleChange}
                className="w-full bg-[#1a181f] border border-gray-700 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Designation
              </label>
              <input
                name="designation"
                type="text"
                value={form.designation}
                onChange={handleChange}
                className="w-full bg-[#1a181f] border border-gray-700 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Profile Image URL
              </label>
              <input
                name="profileImage"
                type="text"
                value={form.profileImage}
                onChange={handleChange}
                className="w-full bg-[#1a181f] border border-gray-700 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg text-base font-medium hover:opacity-90 transition cursor-pointer mt-4"
            >
              {loading ? "Updating..." : "Apply Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}