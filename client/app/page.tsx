"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PipelineDataMap from "@/components/pipelineDataMap";
import { ArrowRight, Lock, BrainCircuit, Database, Fingerprint, Search, Zap, User, BookOpen, FileText, Network, Share2, Cog, Sparkles, Code, Cpu, Workflow, GitBranch } from "lucide-react";

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

        {/* Hero Header & Background Workflow */}
        <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center mb-16 rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-b from-gray-950/60 to-gray-950/20 shadow-[0_0_50px_rgba(99,102,241,0.05)] group">

          {/* Top highlight border line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

          {/* Background Automation Workflow Visuals */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>

            {/* SVGs and nodes for background */}
            {/* SVGs and nodes for background */}
            <svg className="absolute w-full h-full z-0" viewBox="0 0 1000 500" preserveAspectRatio="none">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base Paths connecting exact node coordinates */}
              <path id="p1" d="M 150,125 C 300,125 350,300 500,300" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
              <path id="p2" d="M 500,300 C 650,300 700,100 850,100" fill="none" stroke="rgba(45, 212, 191, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
              <path id="p3" d="M 250,400 C 350,400 400,300 500,300" fill="none" stroke="rgba(236, 72, 153, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
              <path id="p4" d="M 500,300 C 650,300 650,425 800,425" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
              <path id="p5" d="M 150,125 C 150,250 250,250 250,400" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="2" strokeDasharray="5,5" />

              {/* Animated Data Packets Flowing Along Paths */}
              <circle r="4" fill="#818cf8" filter="url(#glow)"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#p1" /></animateMotion></circle>
              <circle r="2" fill="#fff" filter="url(#glow)"><animateMotion dur="4s" begin="-2s" repeatCount="indefinite"><mpath href="#p1" /></animateMotion></circle>

              <circle r="4" fill="#2dd4bf" filter="url(#glow)"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#p2" /></animateMotion></circle>
              <circle r="2" fill="#fff" filter="url(#glow)"><animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite"><mpath href="#p2" /></animateMotion></circle>

              <circle r="4" fill="#f472b6" filter="url(#glow)"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#p3" /></animateMotion></circle>
              <circle r="2" fill="#fff" filter="url(#glow)"><animateMotion dur="6s" begin="-3s" repeatCount="indefinite"><mpath href="#p3" /></animateMotion></circle>

              <circle r="4" fill="#60a5fa" filter="url(#glow)"><animateMotion dur="4.5s" repeatCount="indefinite"><mpath href="#p4" /></animateMotion></circle>
              <circle r="2" fill="#fff" filter="url(#glow)"><animateMotion dur="4.5s" begin="-2s" repeatCount="indefinite"><mpath href="#p4" /></animateMotion></circle>

              <circle r="4" fill="#c084fc" filter="url(#glow)"><animateMotion dur="5.5s" repeatCount="indefinite"><mpath href="#p5" /></animateMotion></circle>
            </svg>

            {/* Floating Nodes - Upgraded & Position-Synced */}
            <div className="absolute top-[25%] left-[15%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gray-900/80 border border-indigo-500/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-[bounce_4s_infinite] overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                <FileText className="text-indigo-400 relative z-10" size={20} />
              </div>
            </div>

            <div className="absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-20 h-20 rounded-2xl bg-indigo-950/80 border border-purple-500/60 flex items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2)_0%,transparent_70%)] animate-pulse"></div>
                <BrainCircuit className="text-purple-400 relative z-10" size={32} />
              </div>
            </div>

            <div className="absolute top-[20%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gray-900/80 border border-teal-500/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(20,184,166,0.2)] animate-[bounce_5s_infinite_1s] overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/10 animate-pulse"></div>
                <Database className="text-teal-400 relative z-10" size={20} />
              </div>
            </div>

            <div className="absolute top-[80%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 rounded-xl bg-gray-900/80 border border-pink-500/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-[bounce_6s_infinite_0.5s] overflow-hidden">
                <div className="absolute inset-0 bg-pink-500/10 animate-pulse"></div>
                <GitBranch className="text-pink-400 relative z-10" size={18} />
              </div>
            </div>

            <div className="absolute top-[85%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gray-900/80 border border-blue-500/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-[bounce_4.5s_infinite_2s] overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                <Code className="text-blue-400 relative z-10" size={20} />
              </div>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto relative z-10 py-20 px-4">
            <p className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs uppercase tracking-[0.2em] text-indigo-300 font-bold mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <Zap size={14} className="text-amber-400 animate-pulse" />
              Powered by NVIDIA NIM & ChromaDB
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Cypher <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[pulse_4s_ease-in-out_infinite]">AI Job Matcher</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              A highly advanced hybrid Retrieval-Augmented Generation (RAG) platform. Semantically match your CV against vector databases and dynamically generate custom application strategies.
            </p>
          </div>
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

        {/* Workflow Automation Design Section */}
        <div className="max-w-6xl mx-auto w-full relative z-10 mt-12 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">System Architecture</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Automated RAG Pipeline</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Our intelligent engine processes your data through a multi-stage vector retrieval and generation system, delivering highly personalized job match strategies in milliseconds.
            </p>
          </div>

          {/* Node Editor UI Container */}
          <div className="relative w-full bg-gray-950/60 border border-indigo-500/10 rounded-3xl p-8 md:p-14 overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Dot Matrix Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_50%,transparent_100%)]"></div>

            {/* Interactive Pipeline Display */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-4">

              {/* Node 1: Ingestion */}
              <div className="flex-1 w-full lg:w-auto relative group">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl relative z-10 group-hover:border-indigo-500/40 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 ring-1 ring-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                    <FileText size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="text-indigo-400 text-xs">01</span> CV Ingestion
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    Deep PDF parsing and semantic chunking of user profile and skill data.
                  </p>
                  {/* Simulated Terminal Log */}
                  <div className="bg-gray-950 rounded-lg p-2.5 font-mono text-[10px] text-green-400 border border-gray-800 flex flex-col gap-1 overflow-hidden h-[44px]">
                    <span><span className="text-gray-500">{'>'}</span> init pdf_parser</span>
                    <span className="animate-pulse"><span className="text-gray-500">{'>'}</span> chunking_text...</span>
                  </div>
                </div>
                {/* Connector Line (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 -right-[15%] w-[30%] h-[2px] bg-gradient-to-r from-indigo-500/20 to-blue-500/20 -translate-y-1/2">
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-blue-500 -translate-y-1/2 translate-x-1/2 shadow-[0_0_12px_rgba(59,130,246,0.9)]"></div>
                </div>
                {/* Connector Line (Mobile) */}
                <div className="block lg:hidden absolute -bottom-[32px] left-1/2 w-[2px] h-[64px] bg-gradient-to-b from-indigo-500/20 to-blue-500/20 -translate-x-1/2 z-0"></div>
              </div>

              {/* Node 2: Embedding */}
              <div className="flex-1 w-full lg:w-auto relative group">
                <div className="bg-gray-900 border border-blue-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.08)] relative z-10 group-hover:border-blue-400 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <Zap size={10} /> NIM
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                    <Cpu size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="text-blue-400 text-xs">02</span> Embeddings
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    NVIDIA Nemotron microservice heavily vectorizes the semantic chunks.
                  </p>
                  {/* Simulated Terminal Log */}
                  <div className="bg-gray-950 rounded-lg p-2.5 font-mono text-[10px] text-blue-400 border border-gray-800 flex flex-col gap-1 overflow-hidden h-[44px]">
                    <span><span className="text-gray-500">{'>'}</span> fetch nemotron</span>
                    <span className="animate-pulse"><span className="text-gray-500">{'>'}</span> dim: [1024] vec...</span>
                  </div>
                </div>
                {/* Connector Line (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 -right-[15%] w-[30%] h-[2px] bg-gradient-to-r from-blue-500/20 to-teal-500/20 -translate-y-1/2">
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-teal-500 -translate-y-1/2 translate-x-1/2 shadow-[0_0_12px_rgba(20,184,166,0.9)]"></div>
                </div>
                {/* Connector Line (Mobile) */}
                <div className="block lg:hidden absolute -bottom-[32px] left-1/2 w-[2px] h-[64px] bg-gradient-to-b from-blue-500/20 to-teal-500/20 -translate-x-1/2 z-0"></div>
              </div>

              {/* Node 3: Vector DB */}
              <div className="flex-1 w-full lg:w-auto relative group">
                <div className="bg-gray-900 border border-teal-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.08)] relative z-10 group-hover:border-teal-400 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 ring-1 ring-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                    <Database size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="text-teal-400 text-xs">03</span> Vector Storage
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    ChromaDB cloud performs rapid HNSW Cosine Distance similarity search.
                  </p>
                  {/* Simulated Terminal Log */}
                  <div className="bg-gray-950 rounded-lg p-2.5 font-mono text-[10px] text-teal-400 border border-gray-800 flex flex-col gap-1 overflow-hidden h-[44px]">
                    <span><span className="text-gray-500">{'>'}</span> insert index</span>
                    <span className="animate-pulse"><span className="text-gray-500">{'>'}</span> calc cosine...</span>
                  </div>
                </div>
                {/* Connector Line (Desktop) */}
                <div className="hidden lg:block absolute top-1/2 -right-[15%] w-[30%] h-[2px] bg-gradient-to-r from-teal-500/20 to-purple-500/20 -translate-y-1/2">
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-purple-500 -translate-y-1/2 translate-x-1/2 shadow-[0_0_12px_rgba(168,85,247,0.9)]"></div>
                </div>
                {/* Connector Line (Mobile) */}
                <div className="block lg:hidden absolute -bottom-[32px] left-1/2 w-[2px] h-[64px] bg-gradient-to-b from-teal-500/20 to-purple-500/20 -translate-x-1/2 z-0"></div>
              </div>

              {/* Node 4: LLM Generation */}
              <div className="flex-1 w-full lg:w-auto relative group">
                <div className="bg-gradient-to-br from-gray-900 to-indigo-950/40 border border-purple-500/40 p-6 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.15)] relative z-10 group-hover:border-purple-400 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <Sparkles size={10} /> Llama 3.3
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 ring-1 ring-purple-500/30 group-hover:bg-purple-500/20 transition-colors">
                    <Workflow size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="text-purple-400 text-xs">04</span> Strategy Gen
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Generative LLM synthesizes retrieved context into actionable strategies.
                  </p>
                  {/* Simulated Terminal Log */}
                  <div className="bg-gray-950 rounded-lg p-2.5 font-mono text-[10px] text-purple-400 border border-gray-800 flex flex-col gap-1 overflow-hidden h-[44px]">
                    <span><span className="text-gray-500">{'>'}</span> RAG context ok</span>
                    <span className="animate-pulse"><span className="text-gray-500">{'>'}</span> generating...</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Complete Pipeline Processing Map */}
        <div className="hidden lg:block">
          <PipelineDataMap />
        </div>

      </main>

      <Footer />
    </div>
  );
}
