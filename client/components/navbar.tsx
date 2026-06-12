"use client"
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { User, LogOut, ChevronDown, LayoutDashboard, Shield, GitBranch, BookOpen, Home, Briefcase, Settings, BriefcaseConveyorBelt } from "lucide-react";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [open1, setOpen1] = useState(false);
  const dropdownRef1 = useRef<HTMLDivElement>(null);

  const [open2, setOpen2] = useState(false);
  const dropdownRef2 = useRef<HTMLDivElement>(null);

  const [open3, setOpen3] = useState(false);
  const dropdownRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("userName"));

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const rawPayload = typeof window !== "undefined"
            ? window.atob(base64)
            : Buffer.from(base64, "base64").toString("binary");
          const payload = JSON.parse(rawPayload);
          setUserRole(payload.role || "user");
        }
      } catch (e) {
        setUserRole("user");
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target as Node)) {
        setOpen1(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target as Node)) {
        setOpen2(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef3.current && !dropdownRef3.current.contains(event.target as Node)) {
        setOpen3(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("adminUnlocked");
    window.location.href = "/codeforge/login"; // redirect to login
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 bg-gray-950/80 backdrop-blur-md border-b border-indigo-500/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            CF
          </div>
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-white transition-colors">
            CodeForge
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors py-1">
            <Home size={14} className="text-blue-400" />
            <span>Home</span>
          </Link>
          <div className="relative" ref={dropdownRef1}>
            <button
              onClick={() => setOpen1(!open1)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-indigo-500/10 hover:border-indigo-700/20 rounded-full transition-all text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <GitBranch size={14} className="text-indigo-400" />
              <span>Architecture Flow</span>
            </button>
            {open1 && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-indigo-500/10 rounded-xl shadow-2xl py-1.5 text-slate-300 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="py-1">
                  <Link href="/flowDiagrams/loginFlow" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                    <GitBranch size={14} className="text-indigo-400" />
                    <span>Auth Lifecycles</span>
                  </Link>
                  <Link href="/flowDiagrams/atsPipeline" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                    <GitBranch size={14} className="text-blue-400" />
                    <span>ATS Architecture</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={dropdownRef2}>
            <button
              onClick={() => setOpen2(!open2)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-indigo-500/10 hover:border-indigo-700/20 rounded-full transition-all text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <Briefcase size={14} className="text-amber-400" />
              <span>AI Job Matcher</span>
            </button>

            {open2 && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-indigo-500/10 rounded-xl shadow-2xl py-1.5 text-slate-300 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="py-1">
                  <Link href="/job-matcher" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                    <Briefcase size={14} className="text-amber-400" />
                    <span>AI Job Matcher</span>
                  </Link>

                  <Link href="/atsPipeline" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                    <BriefcaseConveyorBelt size={14} className="text-blue-400" />
                    <span>ATS Score Checker</span>
                  </Link>

                </div>
              </div>
            )}
          </div>
          <Link href="/documentation" className="flex items-center gap-1.5 hover:text-white transition-colors py-1">
            <BookOpen size={14} className="text-emerald-400" />
            <span>Documentation</span>
          </Link>
          <Link href="/contact" className="flex items-center gap-1.5 hover:text-white transition-colors py-1">
            <Shield size={14} className="text-purple-400" />
            <span>Contact</span>
          </Link>
        </nav>

        {/* User Session Action */}
        <div className="flex items-center gap-4">
          {userName ? (
            <div className="relative" ref={dropdownRef3}>
              <button
                onClick={() => setOpen3(!open3)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-indigo-500/10 hover:border-indigo-700/20 rounded-full transition-all text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  {getInitials(userName)}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">{userName}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${open3 ? "rotate-180" : ""}`} />
              </button>

              {open3 && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-indigo-500/10 rounded-xl shadow-2xl py-1.5 text-slate-300 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-indigo-500/10">
                    <p className="text-xs text-slate-555 font-semibold uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-slate-200 truncate mt-0.5">{userName}</p>
                    {userRole && (
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1.5 uppercase ${userRole === "owner" ? "bg-red-500/20 text-red-300 border border-red-500/35" :
                        userRole === "superuser" ? "bg-orange-500/20 text-orange-300 border border-orange-500/35" :
                          userRole === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/35" :
                            "bg-blue-500/20 text-blue-300 border border-blue-500/35"
                        }`}>
                        {userRole}
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                      <User size={14} className="text-teal-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                      <LayoutDashboard size={14} />
                      <span>Admin Panel</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                      <Settings size={14} />
                      <span>Settings</span>
                    </Link>
                    <Link href="/flowDiagrams/loginFlow" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                      <GitBranch size={14} />
                      <span>Auth Lifecycles</span>
                    </Link>
                    <Link href="/flowDiagrams/atsPipeline" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-350 hover:bg-slate-800 hover:text-white transition-colors">
                      <GitBranch size={14} className="text-blue-400" />
                      <span>ATS Architecture</span>
                    </Link>
                  </div>

                  <div className="border-t border-indigo-500/10 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/15 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}