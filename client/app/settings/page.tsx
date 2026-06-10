"use client";

import React, { useState, useEffect } from 'react';
import { BsNvidia } from "react-icons/bs";
import Link from 'next/link';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  // Load existing key on mount
  useEffect(() => {
    const existingKey = localStorage.getItem("nvidia_api_key");
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("nvidia_api_key", apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem("nvidia_api_key");
    setApiKey("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400 mb-2">
                Settings & Integrations
              </h1>
              <p className="text-slate-400">
                Configure your local integrations. We use a Bring Your Own Key (BYOK) architecture to guarantee maximum privacy.
              </p>
            </div>
            <Link href="/job-matcher" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700 whitespace-nowrap">
              Back to Job Matcher
            </Link>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-xl">🔑</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-200">NVIDIA NIM API Key</h2>
                    <p className="text-sm text-slate-400">Required for AI Job Search and Reranking</p>

                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <BsNvidia className="w-12 h-10 text-green-400 bg-black rounded px-2 py-1" />
                  <a
                    href="https://build.nvidia.com/settings/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-md text-green-400 hover:text-indigo-500 transition-colors underline"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Get NVIDIA API Key
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your API key is securely stored in your browser&apos;s local storage. It is never saved to our databases or shared with any third party. It is only sent directly to our backend temporarily when you execute a search.
                </p>

                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="nvapi-..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all font-mono"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
                  >
                    Save Key
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-slate-700"
                  >
                    Clear Key
                  </button>
                </div>

                {saved && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2 animate-pulse">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Settings saved successfully to local storage.
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
