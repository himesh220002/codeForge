"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  Briefcase,
  Sparkles,
  Database,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Brain,
  Loader2,
  UserCheck,
  Compass,
  Send,
  Upload,
  Search,
  Zap,
  Fingerprint,
  BrainCircuit,
  PenTool,
  Check
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

interface JobMatch {
  _id: string;
  title: string;
  company: string;
  description: string;
  link: string;
  score: number;
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
    <div className="space-y-3 text-slate-350">
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
          <p key={idx} className="text-sm leading-relaxed text-slate-300 my-1.5">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

export default function JobMatcherPage() {
  const [cvText, setCvText] = useState('');
  const [prompt, setPrompt] = useState('Find me jobs where my skills align well and outline why I am a match.');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [strategy, setStrategy] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [parsingPdf, setParsingPdf] = useState(false);

  // Load existing CV text from local storage if present
  useEffect(() => {
    const savedCv = localStorage.getItem("uploaded_pdf_text");
    if (savedCv) {
      setCvText(savedCv);
    }
  }, []);

  const pipelineNodes = [
    { id: 0, title: "Initialize RAG", desc: "Skipping scraper (ChromaDB Testing Mode)", icon: Search },
    { id: 1, title: "Embed Live", desc: "Skipping embedding generation for live jobs", icon: Zap },
    { id: 2, title: "Vectorize Profile", desc: "NVIDIA NIM llama-nemotron-embed", icon: Fingerprint },
    { id: 3, title: "Semantic Search", desc: "Querying ChromaDB Vector Database natively", icon: Database },
    { id: 4, title: "AI Reranking", desc: "NVIDIA Llama-Nemotron-Rerank", icon: BrainCircuit },
    { id: 5, title: "Strategy Gen", desc: "Meta Llama 3.3 Drafts", icon: PenTool }
  ];

  // Example CV text to let the user populate quickly
  const handleLoadSampleCV = () => {
    setCvText(`John Doe
johndoe@email.com | 123-456-7890 | LinkedIn: johndoe-dev

SUMMARY:
Passionate Full-Stack Developer with 3+ years of experience specializing in building responsive interfaces with Next.js, deploying Node.js microservices, and writing MongoDB schemas. Comfortable working with real-time architectures like Apache Kafka.

SKILLS:
- Frontend: React.js, Next.js (App Router), TypeScript, Tailwind CSS, Redux
- Backend: Node.js, Express, REST APIs, JSON Web Tokens (JWT)
- Database: MongoDB, Mongoose, Redis
- Infrastructure: Docker, Apache Kafka, GitHub Actions
- Languages: JavaScript, Python, HTML/CSS`);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingPdf(true);
    setError('');
    setSuccess('');
    try {
      const extractedText = await extractTextFromPdf(file);
      setCvText(extractedText);
      localStorage.setItem("uploaded_pdf_text", extractedText);
      setSuccess("📄 Your PDF has been parsed and stored locally on your computer. No one else can see or use it. It will remain until you log out or close your session.");
      // Auto-clear alert message after 8 seconds
      setTimeout(() => setSuccess(''), 8000);
    } catch (err) {
      console.error(err);
      setError("Failed to parse PDF resume: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setParsingPdf(false);
      // Reset input value so same file can be uploaded again
      e.target.value = '';
    }
  };

  const handleSeedJobs = async () => {
    setSeeding(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to seed database.');
      setSuccess('Job postings and vector embeddings successfully seeded in MongoDB!');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong while seeding database.');
    } finally {
      setSeeding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim()) {
      setError('Please paste your CV or profile text.');
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setError('');
    setSuccess('');
    setMatches([]);
    setStrategy('');

    try {
      const apiKey = localStorage.getItem("nvidia_api_key");
      const headers: any = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/jobs/match`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ cvText, prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to run matching pipeline.');
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("Response streaming is not supported by this browser.");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Save the last partial line back to the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const payload = JSON.parse(line);
            if (payload.type === 'progress') {
              setLoadingStep(payload.step);
            } else if (payload.type === 'partial_result') {
              setMatches(payload.data.matches || []);
            } else if (payload.type === 'result') {
              const matchesList = payload.data.matches || [];
              const strategyText = payload.data.strategy || '';
              setMatches(matchesList);
              setStrategy(strategyText);
              setSuccess('AI similarity search and strategy generation completed successfully!');

              // Save details to profile history list in localStorage
              if (matchesList.length > 0 || strategyText) {
                const averageScore = matchesList.length > 0
                  ? (matchesList.reduce((acc: number, m: any) => acc + (m.score || 0), 0) / matchesList.length) * 100
                  : 0;

                const newHistoryItem = {
                  id: Date.now().toString(),
                  timestamp: new Date().toLocaleString(),
                  cvText: cvText,
                  prompt: prompt,
                  matches: matchesList,
                  strategy: strategyText,
                  rating: Math.round(averageScore)
                };

                const existingHistory = JSON.parse(localStorage.getItem("profile_history") || "[]");
                localStorage.setItem("profile_history", JSON.stringify([newHistoryItem, ...existingHistory]));
              }
            } else if (payload.type === 'error') {
              setError(payload.message || 'Error occurred during pipeline step.');
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("Failed to parse stream line:", line, e);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Network error or backend timeout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-xs font-semibold text-amber-400 mb-4 uppercase tracking-wider">
            <Brain size={12} />
            <span>NVIDIA NIM & Llama-Nemotron RAG Pipeline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            AI-Powered Vector Job Matcher
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Convert your resume into high-dimensional vector embeddings using NVIDIA's <code className="text-indigo-400 bg-slate-900/60 px-1.5 py-0.5 rounded text-xs">llama-nemotron-embed</code> model.
            Rank matches in real-time against seeded positions using <code className="text-indigo-400 bg-slate-900/60 px-1.5 py-0.5 rounded text-xs">llama-nemotron-rerank</code>, and use <code className="text-indigo-400 bg-slate-900/60 px-1.5 py-0.5 rounded text-xs">Meta Llama 3.3 70B</code> to draft outreach pitches.
          </p>
        </div>

        {/* Action Notifications */}
        <div className="max-w-5xl mx-auto mb-8 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2.5 shadow-lg">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-start gap-2.5 shadow-lg">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* BYOK Settings Section */}
        <div className="bg-gray-900/30 border border-slate-850 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="text-xl">🔑</span>
              BYOK Integration
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
              Bring your own NVIDIA API key to enable job searching locally. Keys are stored safely in your browser.
            </p>
          </div>
          <Link
            href="/settings"
            className="w-full sm:w-auto shrink-0 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Configure Settings
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto relative z-10">



          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/85 rounded-2xl p-6 shadow-xl relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b border-slate-800/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <UserCheck size={16} />
                  </div>
                  <h3 className="font-bold text-white text-base">Profile Input</h3>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/20 px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-inner">
                    <Upload size={12} />
                    <span>{parsingPdf ? "Parsing..." : "Upload PDF"}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePdfUpload}
                      disabled={parsingPdf}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleCV}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    Load Sample CV
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cvText" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Paste Resume/CV Text
                  </label>
                  <textarea
                    id="cvText"
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Paste details of your education, skills, work history, and projects here..."
                    className="w-full h-72 bg-gray-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all text-sm font-mono leading-relaxed"
                  />
                </div>

                <div>
                  <label htmlFor="prompt" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Target Criteria / Prompt
                  </label>
                  <input
                    id="prompt"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Remote Next.js jobs with full-stack capabilities."
                    className="w-full bg-gray-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-slate-400" />
                      <span>Running RAG pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Find Matches & Draft Pitch</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Database Utility Section */}
            <div className="bg-gray-900/30 border border-slate-850 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Database size={15} className="text-slate-400" />
                  Vector Database Seeding
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                  Seed MongoDB with 5 realistic software developer postings. This generates embeddings and stores them.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSeedJobs}
                disabled={seeding || loading}
                className="w-full sm:w-auto shrink-0 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {seeding ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-indigo-400" />
                    <span>Seeding...</span>
                  </>
                ) : (
                  <>
                    <Compass size={12} className="text-indigo-400" />
                    <span>Seed Job Listings</span>
                  </>
                )}
              </button>
            </div>

            {/* BYOK Settings Section */}
            <div className="bg-gray-900/30 border border-slate-850 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="text-xl">🔑</span>
                  BYOK Integration
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                  Bring your own NVIDIA API key to enable job searching locally. Keys are stored safely in your browser.
                </p>
              </div>
              <Link
                href="/settings"
                className="w-full sm:w-auto shrink-0 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                Configure Settings
              </Link>
            </div>

          </div>

          {/* Right Column: Output / Results */}
          <div className="lg:col-span-7 space-y-6">

            {/* If not loaded yet */}
            {!loading && matches.length === 0 && !strategy && (
              <div className="bg-gray-900/40 border border-slate-800/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
                <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 border border-slate-800 mb-4">
                  <Briefcase size={26} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Matches Generated Yet</h3>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-6">
                  Paste your CV/Profile, write down what you are looking for, and hit the matching button to kick off semantic embedding calculations.
                </p>
                <button
                  onClick={handleLoadSampleCV}
                  className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all cursor-pointer"
                >
                  Get Started with Sample CV
                </button>
              </div>
            )}

            {/* If loading and matches not yet received */}
            {loading && matches.length === 0 && (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/85 rounded-2xl p-8 shadow-xl min-h-[500px] flex flex-col justify-start relative overflow-hidden">
                {/* Glow border overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                {/* Safeguard Message Banner */}
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 mb-8 text-amber-400 flex items-start gap-3 shadow-inner">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h5 className="font-bold text-sm">RAG Processing Status</h5>
                    <p className="text-xs text-amber-500/90 mt-1 leading-relaxed">
                      This might take a while to process. The pipeline is fetching live RSS feeds, vectorizing profile variables via NVIDIA llama-nemotron-embed, performing local similarity searches, reranking with llama-nemotron-rerank, and invoking Meta Llama 3.3 70B for strategy drafting.
                    </p>
                  </div>
                </div>

                {/* Processing Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-850">
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                    <h3 className="font-bold text-white text-base">Running RAG Pipelines...</h3>
                  </div>
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md font-semibold">
                    Step {loadingStep + 1} of {pipelineNodes.length}
                  </span>
                </div>

                {/* Pipeline Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                  {pipelineNodes.map((node) => {
                    const isCompleted = node.id < loadingStep;
                    const isActive = node.id === loadingStep;
                    const isUpcoming = node.id > loadingStep;

                    return (
                      <div 
                        key={node.id} 
                        className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-500 flex flex-col gap-3
                          ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/30' : 
                            isActive ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 
                            'bg-gray-900/40 border-slate-800 opacity-50'}`}
                      >
                        {/* Background Pulse for Active Node */}
                        {isActive && (
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full animate-pulse pointer-events-none" />
                        )}

                        <div className="flex items-center justify-between">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-lg border shadow-sm transition-colors duration-500
                            ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 
                              isActive ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 
                              'bg-slate-800 border-slate-700 text-slate-500'}`}
                          >
                            <node.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'animate-pulse' : ''} />
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                            ${isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 
                              isActive ? 'bg-indigo-500/10 text-indigo-400' : 
                              'bg-slate-800 text-slate-500'}`}>
                            {isCompleted ? 'Done' : isActive ? 'Processing' : 'Pending'}
                          </span>
                        </div>

                        <div>
                          <h4 className={`text-sm font-bold transition-colors ${isCompleted ? 'text-emerald-300' : isActive ? 'text-white' : 'text-slate-500'}`}>
                            {node.title}
                          </h4>
                          <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? 'text-emerald-500/70' : isActive ? 'text-indigo-200/70' : 'text-slate-600'}`}>
                            {node.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Match Listings and generative pitches */}
            {(matches.length > 0 || strategy) && (
              <div className="space-y-6">

                {/* Seed matches list */}
                {matches.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Briefcase size={12} className="text-blue-400" />
                      Semantic Search Top Matches
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {matches.map((job, index) => (
                        <div
                          key={job._id || index}
                          className="bg-gray-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/30 transition-all relative overflow-hidden group"
                        >
                          {/* Match score indicator */}
                          <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none" />

                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                                {(job.score * 100).toFixed(0)}% Match
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-indigo-400 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-[11px] text-slate-450 mt-0.5">{job.company}</p>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                              {job.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-850">
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 rounded-lg transition-all"
                            >
                              <span>Apply Directly</span>
                              <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI generated report */}
                {strategy ? (
                  <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl relative">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-850">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Brain size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">Custom Application Strategy</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Meta Llama 3.3 70B Strategy</p>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <MarkdownRenderer content={strategy} />
                    </div>
                  </div>
                ) : (
                  loading && matches.length > 0 && (
                    <div className="bg-gray-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl relative flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
                      <h3 className="font-bold text-white text-base">Drafting Custom Application Strategy...</h3>
                      <p className="text-xs text-slate-400 mt-2 text-center max-w-md">Our AI is analyzing the top matched jobs and writing customized outreach pitches. This takes a few seconds.</p>
                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
