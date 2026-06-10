"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { BsNvidia } from 'react-icons/bs';
import {
  User,
  Shield,
  Key,
  Upload,
  Trash2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Award,
  ExternalLink,
  Save,
  FileText
} from 'lucide-react';

interface JobMatch {
  _id: string;
  title: string;
  company: string;
  description: string;
  link: string;
  score: number;
}

interface ProfileHistoryItem {
  id: string;
  timestamp: string;
  cvText: string;
  prompt: string;
  matches: JobMatch[];
  strategy: string;
  rating: number;
}

// Helper to convert inline markdown (**bold**, [link](url)) to HTML
const renderInlineMarkdown = (text: string) => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold inline-flex items-center gap-0.5">$1 <svg class="h-3 w-3 inline-block" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg></a>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

// Custom Markdown Renderer Component
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-3 text-slate-300">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // H3 Header
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-md font-bold text-indigo-300 mt-4 mb-2">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }
        // H2 Header
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3 border-b border-slate-800 pb-1.5 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              {trimmed.replace('## ', '')}
            </h3>
          );
        }
        // H1 Header
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-xl font-extrabold text-white mt-8 mb-4">
              {trimmed.replace('# ', '')}
            </h2>
          );
        }
        // Bullet list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const contentText = trimmed.substring(2);
          return (
            <ul key={idx} className="list-disc pl-5 my-1 text-sm text-slate-300">
              <li className="pl-1">{renderInlineMarkdown(contentText)}</li>
            </ul>
          );
        }
        // Ordered list
        if (/^\d+\.\s/.test(trimmed)) {
          const contentText = trimmed.replace(/^\d+\.\s/, '');
          return (
            <ol key={idx} className="list-decimal pl-5 my-1 text-sm text-slate-300">
              <li className="pl-1">{renderInlineMarkdown(contentText)}</li>
            </ol>
          );
        }
        // Empty lines
        if (trimmed === '') {
          return <div key={idx} className="h-1" />;
        }

        // Paragraph
        return (
          <p key={idx} className="text-sm leading-relaxed text-slate-350 my-1.5">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

// PDF Dynamic Loader Utilities
const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error("Cannot run PDF parsing on server-side"));
      return;
    }
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      resolve(pdfjsLib);
    };
    script.onerror = (e) => reject(new Error("Failed to load PDF.js from CDN"));
    document.body.appendChild(script);
  });
};

const extractTextFromPdf = async (file: File): Promise<string> => {
  const pdfjsLib = await loadPdfJs();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        resolve(extractedText);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

export default function ProfilePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cvText, setCvText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [history, setHistory] = useState<ProfileHistoryItem[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // 1. Get user session details
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

    // 2. Load CV Text
    const savedCvText = localStorage.getItem("uploaded_pdf_text");
    if (savedCvText) {
      setCvText(savedCvText);
    }

    // 3. Load NVIDIA NIM API Key
    const savedApiKey = localStorage.getItem("nvidia_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // 4. Load Match History
    const savedHistory = localStorage.getItem("profile_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse profile history:", e);
      }
    }
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingPdf(true);
    setError("");
    setSuccess("");
    try {
      const extractedText = await extractTextFromPdf(file);
      setCvText(extractedText);
      localStorage.setItem("uploaded_pdf_text", extractedText);
      setSuccess("📄 Your PDF has been parsed and stored locally on your computer. No one else can see or use it. It will remain until you log out or close your session.");
      // Clear alert after 8s
      setTimeout(() => setSuccess(''), 8000);
    } catch (err) {
      console.error(err);
      setError("Failed to parse PDF resume: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setParsingPdf(false);
      e.target.value = '';
    }
  };

  const handleSaveCvText = () => {
    localStorage.setItem("uploaded_pdf_text", cvText);
    setSuccess("✅ Your CV details have been saved locally.");
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    localStorage.setItem("nvidia_api_key", apiKey.trim());
    setSuccess("🔑 NVIDIA NIM API Key successfully saved locally.");
    setSavingSettings(false);
    setTimeout(() => setSuccess(''), 3500);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("nvidia_api_key");
    setApiKey("");
    setSuccess("🗑️ NVIDIA NIM API Key cleared from local storage.");
    setTimeout(() => setSuccess(''), 3500);
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("profile_history", JSON.stringify(updatedHistory));
    setSuccess("🗑️ Match history entry removed.");
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all your job match history?")) {
      localStorage.removeItem("profile_history");
      setHistory([]);
      setSuccess("🗑️ All job match history has been cleared.");
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const toggleExpandHistory = (id: string) => {
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null);
    } else {
      setExpandedHistoryId(id);
    }
  };

  // Helper to render rating stars / badge
  const renderRatingBadge = (rating: number) => {
    const stars = Math.round(rating / 20); // 0-100 to 0-5 stars
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < stars ? "text-amber-400" : "text-slate-700"}>★</span>
          ))}
        </div>
        <span className="text-xs font-bold text-slate-300">({rating}%)</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/25 rounded-full text-xs font-semibold text-teal-400 mb-4 uppercase tracking-wider">
            <User size={12} />
            <span>Developer Dashboard</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            My Developer Profile
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Manage your CV credentials, review NVIDIA NIM API integrations, and explore local job matching analytics.
            All stored variables remain strictly on your local browser.
          </p>
        </div>

        {/* Notifications Bar */}
        <div className="max-w-5xl mx-auto mb-8 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2.5 shadow-lg">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-start gap-2.5 shadow-lg transition-all animate-fade-in">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto relative z-10">

          {/* Left Column: User Profile details & BYOK Key */}
          <div className="lg:col-span-4 space-y-6">

            {/* User Details Box */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 text-sm font-bold">@</span>
                Account Session Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-slate-850 pb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow">
                    {userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "G"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{userName || "Guest Developer"}</h4>
                    <p className="text-xs text-slate-500">{userName ? "Active local session" : "Not logged in"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">Access Scope</span>
                  <span className={`inline-block px-2 py-0.5 rounded font-bold uppercase ${userRole === "owner" ? "bg-red-500/20 text-red-300 border border-red-500/35" :
                    userRole === "superuser" ? "bg-orange-500/20 text-orange-300 border border-orange-500/35" :
                      userRole === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/35" :
                        userName ? "bg-blue-500/20 text-blue-300 border border-blue-500/35" :
                          "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                    {userRole || (userName ? "user" : "guest")}
                  </span>
                </div>

                {!userName && (
                  <div className="pt-2 border-t border-slate-850">
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white rounded-xl shadow-md transition-all"
                    >
                      Sign In / Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* BYOK Settings Box */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                <Key size={16} className="text-indigo-400" />
                BYOK <span className='text-green-400 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent'>NVIDIA NIM Key</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Connect your NVIDIA API Key to execute RAG similarity logic locally. Stored exclusively in your browser.
              </p>

              <form onSubmit={handleSaveApiKey} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="nvapi-..."
                    className="w-full bg-gray-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 placeholder:text-slate-700 transition-all font-mono text-sm"
                  />
                  <div className="absolute right-2.5 top-2.5">
                    <BsNvidia className="text-green-400 h-5 w-5" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-grow inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold text-white rounded-xl shadow transition-colors cursor-pointer"
                    disabled={savingSettings}
                  >
                    <Save size={12} />
                    <span>Save Key</span>
                  </button>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClearApiKey}
                      className="inline-flex items-center justify-center px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-xs font-bold text-slate-400 rounded-xl transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-850 text-center">
                <a
                  href="https://build.nvidia.com/settings/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  Get NVIDIA Key <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Privacy Guarantee Information */}
            <div className="bg-slate-900/35 border border-slate-850 rounded-2xl p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <span className="text-sm">🛡️</span> Privacy Guarantee
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your parsed CV, NVIDIA credentials, search patterns, and LLM matching history are maintained directly within local browser buffers. No server-side profiling or logging is executed on external databases.
              </p>
            </div>

          </div>

          {/* Right Column: CV Text Upload & Matching Analytics */}
          <div className="lg:col-span-8 space-y-6">

            {/* CV Upload and Area */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                    <FileText size={16} />
                  </div>
                  <h3 className="font-bold text-white text-base">Curriculum Vitae (CV) Input</h3>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs font-bold text-teal-400 hover:text-teal-300 bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/20 px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={12} />
                    <span>{parsingPdf ? "Parsing..." : "Upload Resume PDF"}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePdfUpload}
                      disabled={parsingPdf}
                    />
                  </label>
                  {cvText && (
                    <button
                      type="button"
                      onClick={handleSaveCvText}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save size={12} />
                      <span>Save CV Text</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste details of your education, skills, work history, and projects here, or upload your PDF resume using the button above to parse it client-side..."
                  className="w-full h-80 bg-gray-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/60 transition-all text-sm font-mono leading-relaxed"
                />
                <p className="text-[11px] text-slate-500">
                  Tip: Uploading a resume PDF automatically extracts formatting structure and populates this local buffer.
                </p>
              </div>
            </div>

            {/* Matching History and suggestions */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Clock size={16} />
                  </div>
                  <h3 className="font-bold text-white text-base">Match History & CV Suggestions</h3>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={handleClearAllHistory}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Clear All History</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-850 rounded-xl">
                  <p className="text-slate-500 text-sm">No job matches run yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Use the Job Matcher to search jobs and generate recommendations.</p>
                  <Link
                    href="/job-matcher"
                    className="mt-4 inline-flex items-center gap-1 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    Go to Job Matcher
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => {
                    const isExpanded = expandedHistoryId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-gray-950 border border-slate-850 hover:border-slate-800 rounded-xl overflow-hidden transition-all"
                      >
                        {/* Header Summarized view */}
                        <div
                          onClick={() => toggleExpandHistory(item.id)}
                          className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer select-none"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar size={11} className="text-indigo-400" />
                                {item.timestamp}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-900 border border-slate-800 rounded text-slate-400 max-w-[200px] truncate">
                                Prompt: {item.prompt}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              <Award size={13} className="text-teal-400" />
                              RAG Pipeline Analysis
                            </h4>
                          </div>

                          <div className="flex items-center gap-4">
                            {renderRatingBadge(item.rating)}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                                className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-900 rounded transition-colors cursor-pointer"
                                title="Delete entry"
                              >
                                <Trash2 size={13} />
                              </button>
                              {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded detail view */}
                        {isExpanded && (
                          <div className="p-5 border-t border-slate-850 bg-slate-900/10 space-y-6">

                            {/* Matches list */}
                            {item.matches && item.matches.length > 0 && (
                              <div>
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Matched Roles ({item.matches.length})</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {item.matches.slice(0, 4).map((job) => (
                                    <div
                                      key={job._id}
                                      className="p-3 bg-gray-950/70 border border-slate-850/60 rounded-lg flex flex-col justify-between"
                                    >
                                      <div>
                                        <div className="flex justify-between items-start gap-1">
                                          <h6 className="text-xs font-bold text-white line-clamp-1">{job.title}</h6>
                                          <span className="text-[9px] font-bold px-1.5 bg-indigo-500/15 text-indigo-300 rounded shrink-0">
                                            {Math.round(job.score * 100)}%
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{job.company}</p>
                                      </div>
                                      <div className="mt-2.5 pt-2 border-t border-slate-900 flex justify-end">
                                        <a
                                          href={job.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-teal-400 hover:text-teal-350"
                                        >
                                          Apply <ExternalLink size={8} />
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Strategy / Suggestions markdown */}
                            {item.strategy && (
                              <div className="pt-4 border-t border-slate-850/60">
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">CV Recommendations & Application Strategy</h5>
                                <div className="prose prose-invert max-w-none bg-gray-950/40 p-4 border border-slate-850/40 rounded-xl">
                                  <MarkdownRenderer content={item.strategy} />
                                </div>
                              </div>
                            )}

                            {/* CV Text copy back details */}
                            <div className="pt-4 border-t border-slate-850/60">
                              <details className="text-xs text-slate-500">
                                <summary className="cursor-pointer font-semibold select-none hover:text-slate-400 transition-colors">
                                  View CV text snapshot used for this match
                                </summary>
                                <pre className="mt-2 p-3 bg-gray-950 border border-slate-850 rounded-lg text-[10px] font-mono text-slate-400 overflow-x-auto max-h-40 overflow-y-auto leading-relaxed">
                                  {item.cvText}
                                </pre>
                              </details>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
