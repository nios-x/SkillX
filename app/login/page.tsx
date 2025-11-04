"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cinzel, Poppins } from "next/font/google";
import { Toaster, toast } from "sonner"; // ✅ import Sonner

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 });
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setBgPosition({ x, y });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setScrollPercent(Math.min(scroll / height, 1));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("✅ Logged in successfully!", {
          description: "Redirecting to dashboard...",
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000); // delay to show toast
      } else {
        const data = await res.json();
        toast.error(data.error || "Login failed. Check your credentials.");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <>
      {/* ✅ Sonner toaster */}
       <Toaster richColors theme="dark" position="top-right" />

      <main
        onMouseMove={handleMouseMove}
        className="min-h-screen  lg:w-screen flex items-center  overflow-hidden relative px-6"
        style={{
          background: `radial-gradient(at ${bgPosition.x}% ${bgPosition.y}%, #1a0b2e, #0d0b16 80%)`,
          transition: "background 0.3s ease",
        }}
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,75,159,0.1),_transparent_70%)]"></div>

        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-16 z-10">
          {/* LEFT SIDE - Branding / Logo */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 px-8 lg:w-[70%]">
             <span className="z-30 animate-gradient-x bg-gradient-to-r text-[200px] from-purple-700 via-pink-500 to-indigo-500 
  bg-clip-text text-transparent  font-extrabold leading-none mf4 w-max 
  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] "
                style={{
                  filter: "brightness(2) contrast(1.0) ",
                  textShadow: `
      0 0 10px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(255, 0, 255, 0.4),
      0 0 40px rgba(147, 51, 234, 0.6)
    `,
                }}> SkillX</span>
            {/* SVG Liquid Effect & Description here */}
          </div>

          {/* RIGHT SIDE - Sign In Form */}
          <div className="flex-1 flex items-center justify-center p-8 lg:w-[30%]">
            <div className="w-full max-w-md h-full flex flex-col justify-center bg-[#161023]/90 border border-pink-500/20 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,75,159,0.25)] backdrop-blur-md text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
              <p className="text-gray-300 text-sm mb-6">Sign in to continue</p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="text-left">
                  <label className="block text-gray-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
                    required
                  />
                </div>

                <div className="text-left">
                  <label className="block text-gray-300 text-sm mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
                    required
                  />
                  <div className="text-right mt-2">
                    <Link
                      href="/forgot-password"
                      className="text-pink-400 hover:text-pink-300 text-sm transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-700 text-white font-semibold hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,75,159,0.5)]"
                >
                  Sign In
                </button>
              </form>

              <p className="mt-6 text-sm text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-pink-500 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
