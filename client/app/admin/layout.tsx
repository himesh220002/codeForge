"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { Eye, EyeOff, Users, Mail, LayoutDashboard, Shield, Lock } from "lucide-react";

interface TokenPayload {
  userId: string;
  role: "owner" | "superuser" | "admin" | "user";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const payload = jwtDecode<TokenPayload>(token);
      setCurrentRole(payload.role);
    } catch {
      setCurrentRole(null);
    }

    const unlocked = localStorage.getItem("adminUnlocked") === "true";
    setIsUnlocked(unlocked);
  }, []);

  const handleUnlock = () => {
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin2026";
    if (password === expectedPassword) {
      localStorage.setItem("adminUnlocked", "true");
      setIsUnlocked(true);
      setError("");
      return;
    }
    setError("Incorrect admin password.");
  };

  const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/contacts", label: "Contacts", icon: Mail },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 text-slate-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-8 shadow-2xl text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <Lock size={24} className="text-red-400" />
            </div>
            <p className="mb-3 font-semibold text-lg text-red-300">Authentication Required</p>
            <p className="text-sm text-slate-400 mb-6">You must be logged in to access the admin panel.</p>
            <Link href="/login" className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/15">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-950 text-slate-100">
        <Navbar />
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gray-900 border border-indigo-500/10 text-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 space-y-4">
            <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Shield size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-center">Admin Access Required</h2>
            <p className="text-sm text-gray-400 text-center">Enter the admin password to unlock the panel.</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleUnlock()}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-indigo-700/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-400 text-center animate-pulse" role="alert">{error}</p>
            )}
            <button
              onClick={handleUnlock}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl transition-all text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg shadow-indigo-500/15"
            >
              Unlock Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-gray-900/50 border-r border-indigo-500/10 p-4 flex flex-col gap-1 shrink-0">
          <div className="mb-4 px-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Admin Panel</h3>
            {currentRole && (
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1.5 uppercase ${currentRole === "owner" ? "bg-red-500/20 text-red-300 border border-red-500/35" :
                currentRole === "superuser" ? "bg-orange-500/20 text-orange-300 border border-orange-500/35" :
                  currentRole === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/35" :
                    "bg-blue-500/20 text-blue-300 border border-blue-500/35"
                }`}>
                {currentRole}
              </span>
            )}
          </div>

          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
              >
                <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                {link.label}
              </Link>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
