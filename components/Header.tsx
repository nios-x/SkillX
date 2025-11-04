"use client";

import { Menu, Moon, Sun, Bell } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  userPoints?: number;
  onToggleTheme?: () => void;
  isDark?: boolean;
  requestCount?: number;
}

export function Header({
  userPoints = 1000,
  onToggleTheme,
  isDark = true,
  requestCount = 3,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Requests", href: "/requests", badge: requestCount > 0 ? requestCount : undefined },
    { label: "Messages", href: "/messages" },
    { label: "My Skills", href: "/my-skills" },
  ];

  return (
    <header className="sticky top-0 z-50 glass rounded-b-2xl border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">X</div>
            <span className="font-bold text-xl text-red-500 hidden sm:inline">SkillX</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-white px-4 py-2 rounded-md hover:bg-white/10 transition-all relative"
              >
                {item.label}
                {item.badge && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
           

            {requestCount > 0 && (
              <Link href="/requests" className="relative">
                <Bell className="w-5 h-5 text-red-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {requestCount}
                </span>
              </Link>
            )}

            <button onClick={onToggleTheme} className="p-2 hover:bg-red-500/10 rounded-full transition">
              {isDark ? <Sun className="w-5 h-5 text-red-500" /> : <Moon className="w-5 h-5 text-red-500" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-red-500/10 rounded-full transition"
            >
              <Menu className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-white px-4 py-2 rounded-md hover:bg-red-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-2 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full inline-flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
