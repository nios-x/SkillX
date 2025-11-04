"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Users, Rocket, Zap } from "lucide-react";
import { Toaster, toast } from "sonner";
import gsap from "gsap";

import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { TutorCard } from "@/components/TutorCard";
import { useAppContext } from "@/context/AppContext";

gsap.registerPlugin(ScrollTrigger);

const initialSkillCategories = [
  { id: "all-skills", label: "All Skills" },
  { id: "coding", label: "Coding" },
  { id: "design", label: "Design" },
  { id: "music", label: "Music" },
  { id: "business", label: "Business" },
  { id: "photography", label: "Photography" },
  { id: "writing", label: "Writing" },
  { id: "languages", label: "Languages" },
];

export default function HomePage() {
  const router = useRouter();
  const [userPoints] = useState(1250);
  const [selectedCategory, setSelectedCategory] = useState("all-skills");
  const [textbar, setTextbar] = useState("");
  const [tutors, setTutors] = useState<any>([]);
  const [modifiedTutors, setModifiedTutors] = useState<any>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { userdata } = useAppContext();
  const [skill, setSkill] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedTutor, setSelectedTutor] = useState({ id: "", name: "", skills: [] });
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 🔮 Initial page load animations
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out" }
    );

    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: ".stat-card", start: "top 90%" },
      }
    );

    const shimmer = gsap.to(".hero-bg", {
      backgroundPosition: "200% center",
      duration: 5,
      repeat: -1,
      ease: "linear",
    });

    return () => shimmer.kill();
  }, []);

  // 🪄 Floating gradient animation
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(".floating-gradient", { x: 50, y: -30, duration: 5, ease: "sine.inOut" })
      .to(".floating-gradient", { x: -60, y: 40, duration: 6, ease: "sine.inOut" });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setShowPopup(false);
    };
    if (showPopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  const handleCategorySelect = (categoryId: string) => setSelectedCategory(categoryId);

  const handleTutorRequest = (tutorId: string) => {
    console.log("Request sent to tutor:", tutorId);
  };

  useEffect(() => {
    const fetchTutors = async () => {
      const res = await fetch("/api/tutors", { method: "POST" });
      const data = await res.json();
      setTutors(data.tutors);
      setModifiedTutors(data.tutors);
    };
    fetchTutors();
  }, []);

  const sendReq = async () => {
    setShowPopup(false);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        body: JSON.stringify({ tutorid: selectedTutor.id, skill, desc }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Request submitted successfully!", {
          description: `You've requested ${skill} from ${selectedTutor.name}`,
        });
      } else toast.error("Failed to submit request. Try again.");
    } catch {
      toast.error("Network error. Please try later.");
    }
    setDesc("");
    setSkill("");
  };

  useEffect(() => {
    if (!textbar) return setModifiedTutors(tutors);
    const q = textbar.toLowerCase();
    setModifiedTutors(
      tutors.filter((t: any) =>
        t.name.toLowerCase().includes(q) ||
        t.skills.some((s: any) =>
          typeof s === "string"
            ? s.toLowerCase().includes(q)
            : Object.values(s).join(" ").toLowerCase().includes(q)
        )
      )
    );
  }, [textbar, tutors]);

  const skillCategories = initialSkillCategories.map((c) => ({
    ...c,
    selected: c.id === selectedCategory,
  }));

  useEffect(() => {
  const gradient = document.querySelector(".floating-gradient-right") as HTMLElement;
  if (!gradient) return;

  const handleMouseMove = (e: MouseEvent) => {
    // Move the gradient toward the actual cursor position
    gsap.to(gradient, {
      x: e.clientX - 200, // offset half width
      y: e.clientY - 200, // offset half height
      duration: 0.6,
      ease: "power2.out",
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);



  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Toaster richColors theme="dark" position="top-right" />

      <div className="min-h-screen mt-10 bg-black text-foreground relative overflow-hidden">
        {/* 🌈 Floating gradients */}
        {/* <div className="floating-gradient absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-r from-fuchsia-500/20 to-purple-600/10 blur-3xl rounded-full" />
        <div className="floating-gradient absolute bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-r from-blue-400/20 to-teal-600/10 blur-3xl rounded-full" /> */}

        <div className="floating-gradient-right absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-fuchsia-500/20 to-purple-600/10 blur-3xl rounded-full pointer-events-none" />


        {/* Popup */}
        <button
          onClick={() => setShowPopup((p) => !p)}
          className="fixed top-6 right-6 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white z-[1001] shadow-lg hover:scale-105 transition-transform"
        >
          {showPopup ? "Close" : "Open"} Popup
        </button>

        {showPopup && (
          <div className=" absolute   inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
              ref={popupRef}
              className="h-max w-[30vw] rounded-3xl border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(120,60,255,0.15))] backdrop-blur-3xl p-6 text-white shadow-2xl scale-100 animate-[popup_0.4s_ease-out]"
            >
              <h2 className="text-2xl mb-4 font-extrabold skillxlogo flex items-center gap-2">
                <Zap className="text-fuchsia-400" /> Learning Requests
              </h2>

              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                <div>Requesting from</div>
                <div className="text-white font-bold mt-1">{selectedTutor.name}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTutor.skills.map((e: any) => (
                    <div key={e.skill.id} className="text-xs p-1 rounded border border-purple-500/30 w-max">
                      {e.skill.name}
                    </div>
                  ))}
                </div>
              </div>

              <label className="text-sm text-white/70 mt-4 block">Skill you want to learn</label>
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full h-10 bg-white/20 rounded-md mt-1 pl-3 text-sm focus:outline-none"
                placeholder="React, Video Editing, etc"
              />

              <label className="text-sm text-white/70 mt-3 block">Describe your learning goal</label>
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full h-10 bg-white/20 rounded-md mt-1 pl-3 text-sm focus:outline-none"
                placeholder="Description"
              />

              <button
                onClick={sendReq}
                className="mt-5 w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white py-2 px-4 rounded-lg font-semibold hover:scale-[1.03] transition-transform"
              >
                Submit Request 🚀
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 relative">
          <section className="hero-bg relative border border-white/10 rounded-2xl overflow-hidden p-10">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/5 to-purple-500/5 animate-[shimmer_5s_linear_infinite]" />
            <div className="relative z-10">
              <h1 className="hero-text text-xl md:text-2xl font-bold mb-2 skillxlogo">Hi, {userdata?.name || "Learner"}</h1>
              <h1 className="hero-text text-5xl md:text-6xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Welcome to SkillX
              </h1>
              <p className="hero-text text-white/70 mb-6 max-w-2xl">
                Learn from expert mentors and share your knowledge worldwide — earning points and recognition through meaningful connections.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="skillxlogo2 bg-gradient-to-r cursor-pointer from-purple-600 to-fuchsia-500 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-105">
                  <Sparkles className="w-4 h-4" /> Start Learning
                </button>
                <button
                  onClick={() => router.push(`/profile/${userdata?.id || ""}`)}
                  className="border border-fuchsia-500/50 text-fuchsia-400 px-6 py-3 cursor-pointer rounded-lg font-semibold hover:bg-fuchsia-500/10 transition-transform hover:scale-105"
                >
                  Set Up Your Skills
                </button>
              </div>
            </div>
          </section>

          {/* Filters + Tutors */}
          <section className="space-y-6">
            <SearchBar setQuery={setTextbar} query={textbar} />
            <FilterChips chips={skillCategories} onSelect={handleCategorySelect} variant="category" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modifiedTutors.map((tutor: any) => (
                <TutorCard
                  key={tutor.id}
                  {...tutor}
                  onRequest={() => handleTutorRequest(tutor.id)}
                  setSelectedTutor={setSelectedTutor}
                  setShowPopup={setShowPopup}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
