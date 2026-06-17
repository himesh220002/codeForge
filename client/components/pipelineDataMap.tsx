"use client";
import React from 'react';
import { FileText, Code2, Cpu, Database, User, Search, Brain, FileOutput, Monitor, ArrowRight, Layers, BrainCircuit, Network, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface NodeProps {
    positionClass: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    colorClass: string;
}

const Node = ({ positionClass, title, subtitle, icon, colorClass }: NodeProps) => (
    <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 w-44 md:w-52 bg-gray-900/80 backdrop-blur-xl border ${colorClass} rounded-2xl p-2 md:p-2 shadow-lg flex flex-col items-center text-center z-20 hover:scale-105 transition-transform cursor-default group ${positionClass}`}
    >
        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-xl mb-1 md:mb-1 flex items-center justify-center border bg-opacity-20 group-hover:bg-opacity-30 transition-all ${colorClass}`}>
            {icon}
        </div>
        <h4 className="text-white text-[10px] md:text-sm font-bold leading-tight mb-1">{title}</h4>
        <p className="text-gray-400 text-[8px] md:text-xs leading-tight">{subtitle}</p>
    </div>
);

export default function PipelineDataMap() {
    return (
        <div className="w-full relative bg-[#02000a] border border-indigo-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.05)] mt-8 mb-16">

            <div className="p-8 md:p-10 border-b border-indigo-500/10 bg-gray-900/50 backdrop-blur-sm relative z-30">
                <div className="flex items-center gap-3 mb-2">
                    <Layers className="text-indigo-400" size={24} />
                    <h3 className="text-2xl font-bold text-white">Complete Pipeline Processing & Data Conversion Map</h3>
                </div>
                <p className="text-slate-400 text-sm max-w-3xl ml-9">
                    Live visualization of data ingestion, semantic retrieval, AI reranking, and strategy generation dynamics.
                </p>
            </div>

            <div className="relative w-full h-[2200px] md:h-[1800px] overflow-hidden">
                {/* Domain Backgrounds (Z-0) */}
                <div className="absolute top-0 left-0 w-full h-[40%] bg-blue-900/5 border-b border-blue-500/10 transition-all">
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-blue-500/70">Data Ingestion Domain</span>
                </div>

                {/* Internal Data Ingestion Diagram (Right Side of Data Ingestion Domain) */}
                <div className="absolute top-[12%] right-[5%] w-[30%] max-w-[380px] h-[30%] min-h-[300px] border border-blue-500/40 rounded-2xl shadow-2xl z-30 hidden md:flex flex-col p-5 overflow-hidden bg-gray-950/90 backdrop-blur-2xl">
                    {/* Title */}
                    <h4 className="text-white text-sm font-bold mb-6 flex items-center justify-center gap-2 w-full">
                        <FileText size={18} className="text-blue-400" />
                        Data Ingestion Pipeline
                    </h4>

                    <div className="flex flex-col items-center justify-between h-full pb-4">
                        {/* Step 1: Large File */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-blue-500/10 text-blue-300 px-2 py-4 rounded-xl border border-blue-500/30 flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.15)] relative">
                                <FileText size={32} className="text-blue-400" />
                                <div className="text-[10px] font-bold">RAW DOCUMENT</div>
                                <div className="text-[8px] text-blue-400/70">PDF / DOCX / TXT</div>
                                {/* Scanning line animation */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/50 shadow-[0_0_8px_#60a5fa] animate-[ping_2s_infinite]"></div>
                            </div>
                        </div>

                        <div className="h-4 w-px bg-blue-500/40 my-1 relative">
                            <ArrowRight size={14} className="absolute -bottom-2 -left-1.5 text-blue-400 rotate-90" />
                        </div>

                        {/* Step 2: Chunks */}
                        <div className="flex flex-col items-center gap-2 w-full">
                            <div className="text-[10px] text-slate-400 font-bold tracking-widest mb-1">SEMANTIC CHUNKING</div>
                            <div className="flex flex-col gap-2 w-full px-6">
                                <div className="bg-indigo-500/10 text-indigo-300 px-3 py-2 rounded-lg text-[10px] border border-indigo-500/30 w-full flex items-center justify-between">
                                    <span>Chunk 1: Skills</span> <Code2 size={12} />
                                </div>
                                <div className="bg-indigo-500/10 text-indigo-300 px-3 py-2 rounded-lg text-[10px] border border-indigo-500/30 w-full flex items-center justify-between">
                                    <span>Chunk 2: Experience</span> <Code2 size={12} />
                                </div>
                                <div className="bg-indigo-500/10 text-indigo-300 px-3 py-2 rounded-lg text-[10px] border border-indigo-500/30 w-full flex items-center justify-between opacity-60">
                                    <span>Chunk N: Education</span> <Code2 size={12} />
                                </div>
                            </div>
                        </div>

                        <div className="h-3 w-px bg-indigo-500/40 my-1 relative">
                            <ArrowRight size={14} className="absolute -bottom-2 -left-1.5 text-indigo-400 rotate-90" />
                        </div>

                        {/* Step 3: Embeddings */}
                        <div className="flex flex-col items-center gap-2 w-full">
                            <div className="text-[10px] text-purple-400 font-bold tracking-widest mb-1 flex items-center gap-1">
                                <Cpu size={12} /> EMBEDDING MODEL
                            </div>
                            <div className="bg-purple-900/30 text-purple-300 font-mono text-[10px] p-3 rounded-xl border border-purple-500/40 w-5/6 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
                                <div className="flex justify-between"><span>Vector 1:</span> <span>[0.12, -0.85, 0.44...]</span></div>
                                <div className="flex justify-between"><span>Vector 2:</span> <span>[0.91,  0.23, -0.1...]</span></div>
                                <div className="flex justify-between"><span>Vector 3:</span> <span>[0.88,  0.12, -0.45...]</span></div>
                                <div className="flex justify-between"><span>Vector 4:</span> <span>[0.71,  0.76, -0.91...]</span></div>
                                <div className="flex justify-between text-purple-500"><span>...</span> <span>...</span></div>
                                <div className="flex justify-between text-purple-400/50" ><span>Vector N:</span> <span className="ml-2">[0.66,  0.15, -0.23...]</span></div>
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1">1024-Dimensional Dense Vectors</div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[40%] left-0 w-full h-[22%] bg-teal-900/5 border-b border-teal-500/10 transition-all">
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-teal-500/70">Semantic Retrieval Domain</span>
                </div>
                <div className="absolute top-[62%] left-0 w-full h-[16%] bg-purple-900/5 border-b border-purple-500/10 transition-all">
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-purple-500/70">Augmentation Domain</span>
                </div>
                <div className="absolute top-[78%] left-0 w-full h-[22%] bg-pink-900/5 transition-all">
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-pink-500/70">Generation Domain</span>
                </div>

                {/* Internal Vector Search Diagram (Right Side of Augmentation Domain) */}
                <div className="absolute top-[44%] right-[5%] w-[30%] max-w-[480px] bg-gray-950/90 backdrop-blur-2xl border border-indigo-500/40 rounded-2xl p-5 shadow-2xl z-30 hidden md:flex flex-col">
                    <h4 className="text-white text-sm font-bold mb-6 flex items-center gap-2">
                        <Network size={18} className="text-teal-400" />
                        Vector Search Internal Workflow
                    </h4>

                    <div className="flex items-start justify-between text-xs text-gray-400 relative h-full">
                        {/* Connecting arrows between columns */}
                        <div className="absolute top-[39.7%] left-[34%] w-[5%] h-[2.5px] bg-indigo-500/30"></div>
                        <div className="absolute top-[39.7%] right-[34%] w-[5%] h-[2.5px] bg-indigo-500/30"></div>
                        <ArrowRight size={14} className="absolute top-[38%] left-[36%] text-indigo-400" />
                        <ArrowRight size={14} className="absolute top-[38%] right-[36%] text-indigo-400 rotate-180" />

                        {/* Left Side: Stored Vectors */}
                        <div className="flex flex-col items-center gap-3 w-1/3">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Database</span>
                            <div className="flex flex-col gap-1.5 w-full items-center">
                                <div className="bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-lg text-[10px] border border-blue-500/30 flex items-center gap-1.5 w-full justify-center">
                                    <FileText size={12} /> Profiles
                                </div>
                                <div className="bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-lg text-[10px] border border-blue-500/30 flex items-center gap-1.5 w-full justify-center">
                                    <FileText size={12} /> Jobs
                                </div>
                            </div>
                            <ChevronDown size={14} className="text-slate-600 mt-2" />
                            <div className="bg-indigo-900/40 text-indigo-300 font-mono text-[10px] py-2 rounded-lg border border-indigo-500/40 mt-1 text-center w-full flex flex-col gap-1 flex min-h-0 overflow-hidden">
                                <div>[0.12, -0.81, 0.45...]</div>
                                <div>[0.85, 0.44, -0.12...]</div>
                                <div>[0.95, -0.23, 0.67...]</div>
                                <div>[-0.33, 0.67, 0.15...]</div>
                                <div>[0.67, -0.42, 0.76...]</div>
                                <div>[-0.42, 0.15, -0.91...]</div>
                                <div className="text-indigo-500 my-0.5">...</div>
                                <div>[ 0.55, 0.23, -0.88... ]</div>
                            </div>
                            <span className="text-[9px] text-indigo-400 font-medium">Large Dense Vectors</span>
                        </div>

                        {/* Center: Nearest Neighbor */}
                        <div className="flex flex-col items-center gap-3 w-1/3 px-2">
                            <span className="text-[10px] uppercase tracking-wider text-teal-500 mb-1">Matching</span>
                            <div className="relative w-16 h-16 flex items-center justify-center mt-2">
                                <div className="absolute inset-0 rounded-full border border-teal-500/20 border-l-teal-400 border-t-teal-400 animate-spin [animation-duration:4s]"></div>
                                <Network size={24} className="text-teal-400" />
                                {/* Connecting dots */}
                                <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-teal-400 rounded-full shadow-[0_0_8px_#2dd4bf]"></div>
                                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-teal-400 rounded-full shadow-[0_0_8px_#2dd4bf]"></div>
                                <div className="absolute bottom-1 right-4 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                            </div>
                            <span className="text-[10px] text-teal-300 font-medium mt-1 text-center">Nearest<br />Neighbor</span>
                            <ChevronDown size={14} className="text-teal-600 my-1" />
                            <div className="bg-teal-500/10 text-teal-300 px-4 py-2 rounded-lg text-[10px] border border-teal-500/40 font-bold w-full text-center shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                                Results
                            </div>
                        </div>

                        {/* Right Side: Query Vector */}
                        <div className="flex flex-col items-center gap-3 w-1/3">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">User Input</span>
                            <div className="bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-lg text-[10px] border border-purple-500/30 flex items-center gap-1.5 w-full justify-center">
                                <User size={12} /> Query
                            </div>
                            <ChevronDown size={14} className="text-slate-600 mt-5" />
                            <div className="bg-purple-900/20 text-purple-300 font-mono text-[10px] px-0 py-2 rounded-lg border border-purple-500/30 mt-1 text-center w-full flex flex-col gap-1">
                                <div>[ 0.15, -0.91, 0.12, ... ]</div>
                                <div>[ -0.70, 0.87, -0.44, ... ]</div>
                                <div className="text-purple-500 my-0.5">...</div>
                            </div>
                            <span className="text-[9px] text-purple-400 font-medium">Query Vector</span>
                        </div>
                    </div>
                </div>

                {/* SVG Wiring & Animations (Z-10) */}
                <svg className="absolute w-full h-full z-10" viewBox="0 0 1000 1200" preserveAspectRatio="none">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* PATHS */}
                    {/* Ingestion */}
                    <path id="path-csv1-script" d="M 300,80 C 400,80 500,100 500,160" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="5,5" className="animate-[pulse_2s_infinite]" />
                    <path id="path-csv2-script" d="M 700,80 C 600,80 500,100 500,160" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="5,5" className="animate-[pulse_2s_infinite]" />
                    <path id="path-script-embed" d="M 500,160 L 500,240" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-embed-vector" d="M 500,240 L 500,320" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-vector-db" d="M 500,320 L 500,420" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeDasharray="5,5" />

                    {/* Retrieval */}
                    <path id="path-user-queryembed" d="M 250,550 L 250,600" fill="none" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-queryembed-qvector" d="M 250,620 L 250,680" fill="none" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-qvector-sim" d="M 320,700 C 390,660 500,600 500,700" fill="none" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-db-sim" d="M 500,420 L 500,700" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeDasharray="5,5" className="animate-[pulse_3s_infinite]" />

                    {/* Augmentation */}
                    <path id="path-sim-rerank" d="M 500,700 L 500,800" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-rerank-result" d="M 500,800 L 500,880" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2" strokeDasharray="5,5" />

                    {/* Generation */}
                    <path id="path-result-llm" d="M 500,880 L 500,1000" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-result-ui" d="M 500,880 C 700,880 750,900 750,950" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-llm-strat" d="M 500,1000 L 500,1100" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="2" strokeDasharray="5,5" />
                    <path id="path-strat-ui" d="M 500,1100 C 650,1100 750,1050 750,950" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="2" strokeDasharray="5,5" />

                    {/* ANIMATED PACKETS */}
                    <circle r="5" fill="#3b82f6" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#path-csv1-script" /></animateMotion></circle>
                    <circle r="3" fill="#fff"><animateMotion dur="3s" begin="0.5s" repeatCount="indefinite"><mpath href="#path-csv1-script" /></animateMotion></circle>

                    <circle r="5" fill="#3b82f6" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#path-csv2-script" /></animateMotion></circle>

                    <circle r="5" fill="#6366f1" filter="url(#glow)"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#path-script-embed" /></animateMotion></circle>
                    <circle r="5" fill="#818cf8" filter="url(#glow)"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#path-embed-vector" /></animateMotion></circle>
                    <circle r="5" fill="#818cf8" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#path-vector-db" /></animateMotion></circle>
                    <circle r="3" fill="#fff"><animateMotion dur="3s" begin="1s" repeatCount="indefinite"><mpath href="#path-vector-db" /></animateMotion></circle>

                    <circle r="5" fill="#14b8a6" filter="url(#glow)"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#path-user-queryembed" /></animateMotion></circle>
                    <circle r="5" fill="#14b8a6" filter="url(#glow)"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#path-queryembed-qvector" /></animateMotion></circle>
                    <circle r="5" fill="#14b8a6" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#path-qvector-sim" /></animateMotion></circle>
                    <circle r="5" fill="#6366f1" filter="url(#glow)"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#path-db-sim" /></animateMotion></circle>

                    <circle r="5" fill="#a855f7" filter="url(#glow)"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#path-sim-rerank" /></animateMotion></circle>
                    <circle r="5" fill="#a855f7" filter="url(#glow)"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#path-rerank-result" /></animateMotion></circle>

                    <circle r="5" fill="#ec4899" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#path-result-llm" /></animateMotion></circle>
                    <circle r="5" fill="#c084fc" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#path-result-ui" /></animateMotion></circle>
                    <circle r="5" fill="#ec4899" filter="url(#glow)"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#path-llm-strat" /></animateMotion></circle>
                    <circle r="5" fill="#ec4899" filter="url(#glow)"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#path-strat-ui" /></animateMotion></circle>
                </svg>

                {/* NODES (Z-20) */}

                {/* Ingestion Domain */}
                <Node positionClass="left-[30%] top-[6.66%]" title="LinkedIn Data" subtitle="final_data.csv" icon={<FileText size={20} />} colorClass="border-blue-500/30 text-blue-400" />
                <Node positionClass="left-[70%] top-[6.66%]" title="Naukri Data" subtitle="marketing_sample.csv" icon={<FileText size={20} />} colorClass="border-blue-500/30 text-blue-400" />
                <Node positionClass="left-[50%] top-[13.33%]" title="Data Extraction" subtitle="seedCsv.ts" icon={<Code2 size={20} />} colorClass="border-blue-500/50 text-blue-400" />
                <Node positionClass="left-[50%] top-[20%]" title="Embedding Model" subtitle="NVIDIA NIM: nemotron" icon={<Cpu size={20} />} colorClass="border-indigo-500/50 text-indigo-400" />
                <Node positionClass="left-[50%] top-[26.66%]" title="Float Vectors" subtitle="1024-Dimension Array" icon={<ArrowRight size={20} />} colorClass="border-indigo-500/30 text-indigo-400" />
                <Node positionClass="left-[50%] top-[35%]" title="Vector Database" subtitle="ChromaDB Cloud" icon={<Database size={20} />} colorClass="border-indigo-500/50 text-indigo-400 bg-indigo-900/20" />

                {/* Retrieval Domain */}
                <Node positionClass="left-[25%] top-[45%]" title="User Query" subtitle="CV + Job Prefs" icon={<User size={20} />} colorClass="border-teal-500/30 text-teal-400" />
                <Node positionClass="left-[25%] top-[52%]" title="Query Embedding" subtitle="NVIDIA NIM (Query Mode)" icon={<Cpu size={20} />} colorClass="border-teal-500/50 text-teal-400" />
                <Node positionClass="left-[25%] top-[59%]" title="Query Vector" subtitle="Array" icon={<ArrowRight size={20} />} colorClass="border-teal-500/30 text-teal-400" />
                <Node positionClass="left-[50%] top-[58.3%]" title="Similarity Search" subtitle="ChromaDB Native HNSW" icon={<Search size={20} />} colorClass="border-teal-500/50 text-teal-400 bg-teal-900/20" />

                {/* Augmentation Domain */}
                <Node positionClass="left-[50%] top-[66.6%]" title="Reranker Model" subtitle="NVIDIA llama-nemotron-rerank" icon={<Brain size={20} />} colorClass="border-purple-500/50 text-purple-400" />
                <Node positionClass="left-[50%] top-[73.3%]" title="Reranked Results" subtitle="Scaled Probability (55-98%)" icon={<Search size={20} />} colorClass="border-purple-500/30 text-purple-400" />

                {/* Generation Domain */}
                <Node positionClass="left-[50%] top-[83.3%]" title="Generative LLM" subtitle="NVIDIA meta/llama-3.3" icon={<Cpu size={20} />} colorClass="border-pink-500/50 text-pink-400" />
                <Node positionClass="left-[50%] top-[91.6%]" title="Strategy Output" subtitle="Analysis Markdown" icon={<FileOutput size={20} />} colorClass="border-pink-500/30 text-pink-400" />

                {/* Output UI */}
                <Node positionClass="left-[75%] top-[79.1%]" title="React UI" subtitle="Job Matcher Dashboard" icon={<Monitor size={20} />} colorClass="border-emerald-500/50 text-emerald-400 bg-emerald-900/20" />

            </div>
        </div>
    );
}
