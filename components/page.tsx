import React from "react";

export default function ProfilePage() {
  const user = {
    name: "Ava Carter",
    handle: "@avac",
    avatar:
      "https://images.unsplash.com/photo-1545996124-7865f3f1b0b7?q=80&w=600&auto=format&fit=crop",
    bio: "Product designer, UX tinkerer, coffee enthusiast. I love teaching micro-interactions and design systems.",
    rating: 4.9,
    ranking: 128,
    totalUsers: 2547,
    skillsAdded: ["UI Design", "Figma", "Interaction Design", "Prototyping"],
    skillsLearned: 38,
  };

  const topPercent = Math.max(
    0,
    Math.round(((user.totalUsers - user.ranking + 1) / user.totalUsers) * 100)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0b12] via-[#0b0910] to-[#120717] text-pink-400 p-8">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      <div className="max-w-5xl mx-auto rounded-2xl bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] p-8 shadow-[0_0_40px_rgba(255,91,214,0.15)]">
        {/* Header */}
        <header className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full ring-4 ring-[#ff5bd6]/40 object-cover shadow-xl"
            />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-pink-100">{user.name}</h1>
            <p className="text-sm text-pink-300/70">{user.handle}</p>
            <p className="mt-2 text-sm text-pink-100/70 max-w-lg">{user.bio}</p>
          </div>
        </header>

        {/* Horizontal Stats Bar */}
        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[rgba(255,255,255,0.015)] rounded-xl p-4">
          {[
            {
              label: "Rating",
              value: `${user.rating.toFixed(1)} ★`,
              width: (user.rating / 5) * 100,
              gradient: "linear-gradient(90deg,#ff5bd6,#c45cff)",
            },
            {
              label: "Ranking",
              value: `#${user.ranking}`,
              width: topPercent,
              gradient: "linear-gradient(90deg,#ff8bd6,#8f63ff)",
            },
            {
              label: "Skills Added",
              value: user.skillsAdded.length,
              width: Math.min(100, (user.skillsAdded.length / 10) * 100),
              gradient: "linear-gradient(90deg,#ffb3da,#caa4ff)",
            },
            {
              label: "Skills Learned",
              value: user.skillsLearned,
              width: Math.min(100, (user.skillsLearned / 100) * 100),
              gradient: "linear-gradient(90deg,#ffd3ee,#d3c4ff)",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-pink-200/70">{stat.label}</p>
              <p className="text-lg font-semibold text-pink-100">
                {stat.value}
              </p>
              <div className="mt-2 w-full bg-[rgba(255,255,255,0.03)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${stat.width}%`, background: stat.gradient }}
                />
              </div>
            </div>
          ))}
        </section>

        <div className="my-8 border-t border-[rgba(255,255,255,0.05)]"></div>

        {/* Main Sections */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Added Skills */}
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

          {/* Enhanced Community Ranking */}
          <div className="bg-gradient-to-br from-[#1a0915] to-[#2a0c1f] p-6 rounded-xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,91,214,0.15)] border border-[rgba(255,255,255,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,214,0.08),transparent)]" />
            <h3 className="text-pink-100 font-semibold mb-6 z-10">
              Community Ranking
            </h3>

            <div className="relative w-40 h-40 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.03)] ring-4 ring-[#ff5bd6]/30 shadow-inner overflow-hidden z-10">
              {/* Animated Gradient Ring */}
              <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,#ff5bd6_0%,#c45cff_100%)] opacity-40" />
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
              mentors worldwide
            </p>
          </div>

          {/* Activity Summary */}
          <div className="bg-[rgba(255,255,255,0.02)] p-5 rounded-xl">
            <h3 className="text-pink-100 font-semibold mb-3">
              Activity Summary
            </h3>
            {[
              { label: "Sessions taught", value: 124 },
              { label: "Avg session length", value: "45m" },
              { label: "Response rate", value: "98%" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.04)]"
              >
                <span className="text-sm text-pink-200/70">{item.label}</span>
                <span className="text-sm font-semibold text-pink-100">
                  {item.value}
                </span>
              </div>
            ))}

            <div className="mt-4">
              <h4 className="text-pink-100/80 font-medium">Achievements</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Top Mentor", "5x 5★ Ratings", "Course Creator"].map(
                  (badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-pink-100"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
