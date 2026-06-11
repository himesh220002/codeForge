"use client";
import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Play, Server, Database } from "lucide-react";
import Navbar from "@/components/navbar";

export default function AtsPipelineCheckerPage() {
    // Form state
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Real result state
    const [result, setResult] = useState<{ structureScore: number; matchScore: number; feedback?: string } | null>(null);
    const [loadingStep, setLoadingStep] = useState(0);
    const [loadingLogs, setLoadingLogs] = useState<{time: string; label: string}[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleRunPipeline = async () => {
        if (!jobDescription || !resumeFile) return;
        
        setIsProcessing(true);
        setLoadingStep(0);
        setLoadingLogs([]);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("jobDescription", jobDescription);

            // Fetch NVIDIA API Key from local storage if BYOK is active
            const userSettingsRaw = localStorage.getItem("userSettings");
            let apiKey = "";
            if (userSettingsRaw) {
                try {
                    const userSettings = JSON.parse(userSettingsRaw);
                    apiKey = userSettings.nvidiaApiKey || "";
                } catch(e) {}
            }

            const response = await fetch("/codeforge/api/ats", {
                method: "POST",
                headers: apiKey ? { "Authorization": `Bearer ${apiKey}` } : {},
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to initiate pipeline");
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Streaming not supported");
            
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || "";
                
                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const payload = JSON.parse(line);
                        if (payload.type === 'progress') {
                            setLoadingStep(payload.step);
                            setLoadingLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), label: payload.label }]);
                        } else if (payload.type === 'result') {
                            setResult({
                                structureScore: payload.data.structureScore,
                                matchScore: payload.data.matchScore,
                                feedback: payload.data.feedback
                            });
                        } else if (payload.type === 'error') {
                            alert("Pipeline Error: " + payload.message);
                        }
                    } catch(e) {
                        console.error("Parse stream error", e);
                    }
                }
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error connecting to the ATS engine.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto w-full p-6 my-10">
                <header className="mb-8 p-6 bg-white/5 rounded-xl shadow-sm border border-slate-800 backdrop-blur-sm">
                    <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Live ATS Score Checker</h1>
                    <p className="text-slate-400 max-w-4xl">
                        Upload your CV and the target Job Description below. This tool runs the resume through our hybrid NLP + Dense Vector backend architecture exactly as a modern applicant tracking system would.
                    </p>
                </header>

                <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                            <Play size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">Initialize Match Engine</h2>
                            <p className="text-slate-400 text-sm">Upload a candidate's CV and provide a job description to calculate exact match overlap.</p>
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Forms */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">
                                    Target Job Description
                                </label>
                                <textarea 
                                    className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
                                    placeholder="Paste the full job description here. The pipeline will isolate hard skills, experience requirements, and core competencies..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">
                                    Candidate Resume (PDF)
                                </label>
                                <div className="w-full border-2 border-dashed border-slate-700 bg-slate-950/50 hover:bg-slate-800/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {resumeFile ? (
                                        <>
                                            <FileText className="w-10 h-10 text-indigo-400 mb-3" />
                                            <p className="text-slate-200 font-medium">{resumeFile.name}</p>
                                            <p className="text-slate-500 text-xs mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready to process</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-slate-500 mb-3" />
                                            <p className="text-slate-300 font-medium">Click or drag PDF to upload</p>
                                            <p className="text-slate-500 text-xs mt-1">Max file size: 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={handleRunPipeline}
                                disabled={isProcessing || !resumeFile || !jobDescription}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing Pipeline...
                                    </>
                                ) : (
                                    <>
                                        Run Contextual ATS Engine <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Output / Results Panel */}
                        <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                                <Database size={200} />
                            </div>

                            <div className="p-4 border-b border-slate-800 bg-slate-900">
                                <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" /> Pipeline Output Feed
                                </h3>
                            </div>

                            <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[300px]">
                                {!isProcessing && !result && (
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                                            <Server size={24} className="text-slate-600" />
                                        </div>
                                        <p className="text-slate-400 text-sm max-w-xs">
                                            Awaiting inputs. The engine will extract structural signals and semantic mappings once initiated.
                                        </p>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 max-w-md">
                                        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-200">Executing Pipeline Layers</h3>
                                                <p className="text-xs font-semibold text-indigo-400 mt-0.5">Step {loadingStep + 1} of 5</p>
                                            </div>
                                        </div>

                                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                                            {loadingLogs.map((log, idx) => (
                                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6">
                                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-900/80 border border-slate-800 p-3 rounded-lg shadow-sm">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-bold text-slate-200 text-sm">{log.label}</span>
                                                        </div>
                                                        <div className="text-xs font-mono text-slate-500">{log.time}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {loadingStep < 4 && (
                                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pb-6">
                                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-slate-900 bg-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 animate-pulse">
                                                    </div>
                                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-indigo-900/10 border border-indigo-500/20 p-3 rounded-lg">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-bold text-indigo-300 text-sm">Processing next layer...</span>
                                                        </div>
                                                        <div className="text-xs font-mono text-indigo-500/50">--:--:--</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {result && !isProcessing && (
                                    <div className="w-full h-full flex flex-col justify-start animate-in zoom-in-95 duration-500">
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-center">
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">CV Structure Score</p>
                                                <div className="text-4xl font-extrabold text-blue-400">
                                                    {result.structureScore}%
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-2">Alignment, Formatting, Layout</p>
                                            </div>
                                            
                                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-center relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2">
                                                    {result.matchScore >= 80 ? (
                                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                                    ) : (
                                                        <AlertTriangle className="text-amber-500 w-5 h-5" />
                                                    )}
                                                </div>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">JD Match Score</p>
                                                <div className={`text-4xl font-extrabold ${result.matchScore >= 80 ? 'text-green-400' : 'text-amber-400'}`}>
                                                    {result.matchScore}%
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-2">Semantic & Keyword Overlay</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300">
                                            <p className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                                                <Database size={16} className="text-indigo-400"/> AI Engine Feedback
                                            </p>
                                            <p className="leading-relaxed text-xs">
                                                {result.feedback || (result.matchScore >= 80 
                                                    ? "Candidate shows strong semantic overlap with core requirements. High density of required keywords and matching action verbs isolated. Recommended for technical interview." 
                                                    : "Moderate alignment detected. While structural layout is valid, semantic mapping highlights gaps in required hard skills and missing specific contextual metrics compared to JD.")}
                                            </p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setResult(null)}
                                            className="mt-6 text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 self-center transition-colors"
                                        >
                                            Reset Pipeline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
