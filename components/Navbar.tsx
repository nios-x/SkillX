// src/components/Header.tsx
"use client";
import { Menu, Moon, Sun, Bell, Star, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; // 👈 NEW
import { usePathname } from "next/navigation"; // 👈 NEW
import { useAppContext } from "@/context/AppContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // 👈 to detect current route
  const { isDark, toggleTheme, userPoints, requestCount, userdata } = useAppContext();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Requests", href: "/requests", badge: requestCount > 0 ? requestCount : undefined },
    { label: "Sessions", href: "/sessions" },
    { label: "Messages", href: "/messages" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Profile", href: `/profile/${userdata?.id || ""}` },  

  ];

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  return (
    <>
      <header className="fixed w-full text-white top-0 z-[9999] glass border-white/10 backdrop-blur-xl animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* === Logo === */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer transition-transform duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[url('/logo.jpeg')] bg-cover"></div>
                <span
                  className="z-30 animate-gradient-x bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-500 
                  bg-clip-text text-transparent text-2xl font-extrabold leading-none mf4 w-max 
                  drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                  style={{
                    filter: "brightness(2) contrast(1.0)",
                    textShadow: `
                      0 0 10px rgba(255, 255, 255, 0.2),
                      0 0 20px rgba(255, 0, 255, 0.4),
                      0 0 40px rgba(147, 51, 234, 0.6)
                    `,
                  }}
                >
                  Skill X
                </span>
              </div>
            </Link>

            {/* === Desktop Navigation === */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href; // 👈 check if current route is active
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-md font-medium text-sm transition-all hover:scale-105 
                      ${isActive ? "text-white" : "text-muted-foreground hover:text-white"}`}
                    style={{ animationDelay: `${0.05 * idx}s` }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="underline"
                        className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {/* Badge */}
                    {item.badge && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              {/* Logout Button */}
              {userdata !== null && (
                <AlertDialog>
                  <AlertDialogTrigger className="relative text-muted-foreground hover:text-white px-4 py-2 rounded-md cursor-pointer hover:bg-white/10 transition-all font-medium text-sm hover:scale-105 animate-slide-in-down">
                    Logout
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[90%] max-w-md rounded-3xl border border-white/20
                      bg-[linear-gradient(45deg,rgba(255,0,255,0.1),rgba(255,255,255,0.02))]
                      backdrop-blur-3xl p-6 text-white shadow-2xl z-[99999]"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="skillxlogo">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to logout from SkillX?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="skillxlogo border-purple-500 cursor-pointer shadow-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="skillxlogo2 text-white cursor-pointer shadow-xl"
                        onClick={handleLogout}
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </nav>

            {/* === Right Side === */}
            <div className="flex items-center gap-3">
              {requestCount > 0 && (
                <Link href="/requests" className="relative animate-bounce-subtle">
                  <Bell className="w-5 h-5 text-purple-500 hover:text-purple-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                    {requestCount}
                  </span>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden border-white/20 border hover:bg-purple-500/10 hover:scale-110 p-2 rounded-full transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {!isMenuOpen ? (
                  <Menu className="w-5 h-5 text-purple-200" />
                ) : (
                  <X className="w-5 h-5 text-purple-200" />
                )}
              </button>

              {/* Points */}
              {userdata !== null && (
                <button className="flex gap-2 justify-center items-center">
                  <span className="text-sm">
                    <Star size={16} />
                  </span>
                  {userdata?.points}
                </button>
              )}
            </div>
          </div>

          {/* === Mobile Menu === */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-2 animate-slide-in-down">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative px-4 py-2 rounded-md font-medium text-sm transition-all 
                      flex items-center justify-between hover:translate-x-1
                      ${isActive ? "text-white bg-purple-500/10" : "text-muted-foreground hover:text-white"}`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="w-5 h-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="underline-mobile"
                        className="absolute left-0 bottom-0 h-[2px] w-full bg-purple-500 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
