"use client";

import { useEffect, useRef } from "react";
import { Star, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export function TutorCard({
  id,
  name,
  bio,
  profileImage,
  stars,
  skills,
  Availability,
  setSelectedTutor,
  setShowPopup,
}: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP float-in animation
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, []);

  const availabilityColors: Record<string, string> = {
    AVAILABLE: "text-green-400",
    BUSY: "text-yellow-400",
    OFFLINE: "text-gray-400",
  };

  return (
    <div
      ref={cardRef}
      className="relative group rounded-2xl p-5 backdrop-blur-2xl bg-gradient-to-br from-white/5 to-purple-500/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-[1.02] overflow-hidden"
    >
      {/* Floating gradient ring on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)] blur-2xl" />

      <Link href={`/profile/${id}`}>
        <div className="flex items-center gap-3 relative z-10">
          <img
            src={
              profileImage ||
              "https://imgs.search.brave.com/jFVeTCCFuwvv0PNiVvGH49cMOj_fW31r9jSQOGI9nnY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZs/YXRpY29uLmNvbS8x/MjgvOTMwNy85MzA3/OTUwLnBuZw"
            }
            alt={name}
            className="w-16 h-16 rounded-xl object-cover border border-purple-400/20 shadow-md group-hover:shadow-purple-500/30 transition-all duration-500"
          />
          <div>
            <h3 className="font-semibold text-lg text-white/90 group-hover:text-purple-400 transition-all">
              {name}
            </h3>
            <p className={`text-[10px] ${availabilityColors[Availability]}`}>
              {Availability}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                i < Math.floor(stars)
                  ? "fill-purple-500 text-purple-500"
                  : "fill-gray-600/30"
              }`}
            />
          ))}
          <span className="text-xs text-purple-400 ml-1">{stars.toFixed(1)}</span>
        </div>

        <p className="text-[12px] text-white/50 mt-2 line-clamp-2 uppercase tracking-wide">
          {bio}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {skills.slice(0, 3).map((s: any) => (
            <span
              key={s.skill.name}
              className="px-2 py-1 text-xs rounded-lg border border-purple-400/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 transition-all"
            >
              {s.skill.name}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex items-center justify-between mt-4 relative z-10">
        <Link href={`/profile/${id}`}>
          <span className="flex items-center gap-1 text-purple-400 text-sm font-medium">
            <Zap className="w-4 h-4" /> 2 pts/hr
          </span>
        </Link>

        <button
          onClick={() => {
            setShowPopup(true);
            setSelectedTutor({ id, name, skills });
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white/80 text-sm px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 shadow-lg shadow-purple-600/20 transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4" /> Request
        </button>
      </div>
    </div>
  );
}
