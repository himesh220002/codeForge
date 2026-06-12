"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowRight, Lock, BrainCircuit, Database, Fingerprint, Search, Zap, User, BookOpen } from "lucide-react";

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative z-10">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs uppercase tracking-[0.2em] text-indigo-400 font-bold mb-6">
            <Zap size={14} className="text-amber-400" />
            Powered by NVIDIA NIM & ChromaDB
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6">
            Cypher <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Job Matcher</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            A highly advanced hybrid Retrieval-Augmented Generation (RAG) platform. Semantically match your CV against vector databases and dynamically generate custom application strategies.
          </p>
        </div>

        {/* Dynamic User Profile Dashboard / Guest Call to Action */}
        <div className="w-full max-w-4xl mx-auto mb-16 relative z-10">
          {isClient && userName ? (
            /* Logged In Dashboard Card */
            <div className="bg-gray-900/60 backdrop-blur-xl border border-indigo-500/10 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-indigo-500/10 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/20">
                    {userName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">Welcome back, {userName}!</h2>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Session actively authenticated via JWT</p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Assigned Role</span>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg mt-1 uppercase ${userRole === "owner" ? "bg-red-500/20 text-red-300 border border-red-500/35" :
                    userRole === "superuser" ? "bg-orange-500/20 text-orange-300 border border-orange-500/35" :
                      userRole === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/35" :
                        "bg-blue-500/20 text-blue-300 border border-blue-500/35"
                    }`}>
                    {userRole || "User"}
                  </span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="mt-8 pt-6 border-t border-indigo-500/10">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Platform Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/job-matcher" className="p-4 bg-gray-950/40 hover:bg-gray-950/80 border border-indigo-500/10 hover:border-indigo-500/30 rounded-xl transition-all group flex flex-col justify-between min-h-[110px]">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
                      <Search size={16} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-slate-200">AI Job Matcher</span>
                      <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                    </div>
                  </Link>

                  <Link href="/profile" className="p-4 bg-gray-950/40 hover:bg-gray-950/80 border border-indigo-500/10 hover:border-teal-500/30 rounded-xl transition-all group flex flex-col justify-between min-h-[110px]">
                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-2">
                      <User size={16} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-slate-200">Developer Profile</span>
                      <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 group-hover:text-teal-400 transition-all" />
                    </div>
                  </Link>

                  <Link href="/documentation" className="p-4 bg-gray-950/40 hover:bg-gray-950/80 border border-indigo-500/10 hover:border-blue-500/30 rounded-xl transition-all group flex flex-col justify-between min-h-[110px]">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
                      <BookOpen size={16} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-slate-200">Architecture Docs</span>
                      <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Guest Card */
            <div className="bg-gray-900/40 border border-indigo-500/10 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center max-w-xl mx-auto">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Access Secure Operations</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm">
                Sign in with your user credentials to test administrative privileges, token auto-refresh flows, and view documentation.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white rounded-lg shadow-lg shadow-blue-500/15 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  <span>Sign In / Register</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-8">Architectural Foundations</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gray-900/40 border border-indigo-500/10 p-6 rounded-2xl hover:bg-gray-900/60 hover:border-indigo-500/30 transition-all shadow-lg group">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <BrainCircuit size={18} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">NVIDIA NIM AI</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Powered by state-of-the-art NVIDIA microservices. Utilizes Nemotron for embeddings & reranking, and Llama 3.3 for strategy generation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/40 border border-indigo-500/10 p-6 rounded-2xl hover:bg-gray-900/60 hover:border-teal-500/30 transition-all shadow-lg group">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                <Database size={18} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">ChromaDB Cloud</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cloud-hosted Chroma cluster handles high-dimensional vector math and performs lightning-fast HNSW Cosine Distance queries.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/40 border border-indigo-500/10 p-6 rounded-2xl hover:bg-gray-900/60 hover:border-pink-500/30 transition-all shadow-lg group">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <Fingerprint size={18} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">BYOK Architecture</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Local-first privacy. CV tracking, API keys, and generative workflows are processed securely from your client session.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
