"use client";
import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import Link from "next/link";
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Play, Server, Database, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import DiagramTabs from "@/components/DiagramTabs";
import { atsPipelineDiagrams } from "./diagramsData";

export default function AtsPipelinePage() {
    const [ready, setReady] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark", // Using dark theme to match our application overall look
            themeVariables: {
                background: "#0f172a",
                primaryColor: "#1e293b",
                primaryTextColor: "#f8fafc",
                lineColor: "#cbd5e1",
            },
        });
        setReady(true);
    }, []);

    useEffect(() => {
        if (ready) {
            const nodes = document.querySelectorAll('.mermaid');
            if (nodes.length > 0) {
                mermaid.run({ nodes: Array.from(nodes) as HTMLElement[] });
            }
        }
    }, [ready]);


    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
            {/* Title Header */}
            <header className="p-6 border-b border-gray-800 bg-gray-900 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        ATS Pipeline Architecture & Demo
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Industrial-Grade Custom ATS Pipeline utilizing NVIDIA NIM and ChromaDB.
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 border border-indigo-700 text-sm font-medium rounded-lg transition-colors"
                >
                    Go Back Home
                </Link>
            </header>

            <div className="max-w-7xl mx-auto w-full p-6 space-y-10">

                {/* ------------------------------------- */}
                {/* DIAGRAM SECTION                       */}
                {/* ------------------------------------- */}
                <section className="bg-slate-900 border border-indigo-500/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-indigo-500/10 bg-slate-900/50">
                        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                            <Server className="text-indigo-400" /> Pipeline Architecture Mapping
                        </h2>
                        <p className="text-slate-400 text-sm max-w-4xl leading-relaxed">
                            This diagram maps out every technical step, micro-decision, and database event needed to build an in-house, enterprise-ready resume screening system. It relies entirely on powerful Node.js libraries, mathematical cosine similarity matching, and NVIDIA’s free tier open-weight models (NVIDIA NIM).
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
                            <span className="px-3 py-1 bg-green-900/50 border border-green-800 text-green-300 rounded-full">In-Memory Vector Matching</span>
                            <span className="px-3 py-1 bg-blue-900/50 border border-blue-800 text-blue-300 rounded-full">NVIDIA NIM (NV-Embed-QA)</span>
                            <span className="px-3 py-1 bg-purple-900/50 border border-purple-800 text-purple-300 rounded-full">Node.js (compromise / pdf-parse)</span>
                            <span className="px-3 py-1 bg-orange-900/50 border border-orange-800 text-orange-300 rounded-full">Natural NLP (TF-IDF)</span>
                            <span className="px-3 py-1 bg-indigo-900/50 border border-indigo-800 text-indigo-300 rounded-full">NVIDIA Llama-3 Insight Engine</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-950 overflow-hidden min-h-[500px] flex justify-center relative">
                        {/* Zoom Controls */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-slate-900 border border-indigo-700/20 p-1.5 rounded-lg shadow-lg">
                            <button
                                onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                                className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button
                                onClick={() => { setZoom(1.6); setPosition({ x: 0, y: 0 }); }}
                                className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                                title="Reset Zoom"
                            >
                                <RefreshCw size={20} />
                            </button>
                            <button
                                onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.4))}
                                className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut size={20} />
                            </button>
                        </div>

                        {ready && (
                            <div
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUpOrLeave}
                                onMouseLeave={handleMouseUpOrLeave}
                                className={`w-full flex justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                style={{ transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.2s ease-in-out', minWidth: '1000px' }}
                            >
                                <div className="mermaid w-full flex justify-center pointer-events-none select-none">
                                    {`flowchart LR
    %% Global Styling Declarations
    classDef ingestion fill:#0c4a6e,stroke:#0284c7,stroke-width:2px,color:#e0f2fe,rx:8px,ry:8px;
    classDef extraction fill:#4a044e,stroke:#c084fc,stroke-width:2px,color:#fae8ff,rx:8px,ry:8px;
    classDef vector fill:#052e16,stroke:#22c55e,stroke-width:2px,color:#dcfce7,rx:8px,ry:8px;
    classDef scoring fill:#431407,stroke:#f97316,stroke-width:2px,color:#ffedd5,rx:8px,ry:8px;
    classDef feedback fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#e0e7ff,rx:8px,ry:8px;

    subgraph P1 [1: Document Normalization]
        direction TB
        A1("Candidate Resumes<br/>[File/PDF Buffer]") --> A2["Node.js pdf-parse<br/>[String Extraction]"] --> A3("Segment Sections<br/>[String: 'Experience...']")
        B1("Job Description<br/>[String]") --> B2["Sanitization<br/>[Regex Filter]"] --> B3("Standardized JD<br/>[Clean String]")
    end
    class A1,A2,A3,B1,B2,B3 ingestion;

    subgraph P2 [2: NLP Tokenization]
        direction TB
        A3 --> C1["Compromise NLP<br/>[Doc Object]"]
        C1 --> C2("Extract Entities<br/>[Array: 'Google', '2023']")
        C1 --> C3("Tech Stack<br/>[Array: 'React', 'AWS']")
        C1 --> C4("Action Verbs<br/>[Array: 'Managed', 'Built']")
    end
    class C1,C2,C3,C4 extraction;

    subgraph P3 [3: Semantic Vectors]
        direction TB
        B3 --> E1
        C2 & C3 & C4 --> E1("Text Chunking<br/>[Array: 'adfa...']") --> E2["NVIDIA nv-embedqa<br/>[API Payload]"]
        E2 --> E3("In-Memory Vectors<br/>[Float32Array[1024]]")
    end
    class E1,E2,E3 vector;

    subgraph P4 [4: Scoring Engine]
        direction TB
        E3 --> H1("Cosine Similarity<br/>[Float: 0.85]") --> L1
        C3 --> J1("TF-IDF Matrix<br/>[Sparse Array]") --> L1
        C2 --> K1("Heuristic Rules<br/>[Int: 5 yrs]") --> L1
        L1{"Composite ATS Score<br/>[Int: 92%]"}
    end
    class H1,J1,K1,L1 scoring;

    subgraph P5 [5: AI Gap Analysis]
        direction TB
        L1 --> N1["NVIDIA Llama 3.1 8B<br/>[LLM API]"]
        N1 --> N2("Identify Missing Skills<br/>[String Array]")
        N1 --> N3("Contextual Gaps<br/>[String]")
        N2 & N3 --> O1("Structured JSON Feedback<br/>[JSON Object]")
    end
    class N1,N2,N3,O1 feedback;

    P1 --> P2 --> P3 --> P4 --> P5`}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Explanatory Footer inside architecture box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900 border-t border-indigo-500/10">
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-indigo-700/20 hover:border-indigo-500/30 transition-colors">
                            <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                                <Database size={16} className="text-yellow-400" /> 1. Ingestion & NLP Parsing
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Uses Node.js <b>pdf-parse</b> for high-accuracy raw layout text extractions. It feeds text chunks straight to the <b>compromise</b> NLP library to clean up and extract named entities, explicit dates, and structural resume segments.
                            </p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-indigo-700/20 hover:border-indigo-500/30 transition-colors">
                            <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                                <Server size={16} className="text-green-400" /> 2. Vector Embeddings
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Chunks are sent via standard API requests to <b>NVIDIA NIM</b> calling the open-weight <b>nvidia/nv-embedqa-e5-v5</b> model. Resulting high-dimensional vectors are evaluated live in-memory via pure mathematical cosine distance logic.
                            </p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-indigo-700/20 hover:border-indigo-500/30 transition-colors">
                            <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                                <CheckCircle size={16} className="text-orange-400" /> 3. Hybrid Scoring Blend
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Calculates ranking using three metrics: 50% Dense Vector semantic matching, 30% <b>Natural.js TF-IDF</b> exact keyword mapping matrix overlays, and 20% deterministic rule-based heuristic checks.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------- */}
                {/* ADVANCED INTERNAL ENGINE DIAGRAM      */}
                {/* ------------------------------------- */}
                <section className="bg-slate-900 border border-indigo-500/10 rounded-xl overflow-hidden shadow-2xl mt-12">
                    <div className="p-6 border-b border-indigo-500/10 bg-slate-900/50">
                        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                            <Server className="text-purple-400" /> Internal Architecture: Llama 3.1 8B Structured JSON Feedback Engine
                        </h2>
                        <p className="text-slate-400 text-sm max-w-4xl leading-relaxed">
                            This diagram exposes the internal structures of the most advanced component in the pipeline: the LLM-driven ATS Evaluator. It demonstrates how raw resume context, mathematical match scores, and strict JSON schemas are injected into the NVIDIA NIM Llama-3.1 8B model to generate the dynamic, section-wise breakdown grid seen on the frontend.
                        </p>
                    </div>

                    <div className="p-4 bg-slate-950 overflow-hidden flex justify-center">
                        {ready && (
                            <div className="mermaid w-full flex justify-center py-6">
                                {`flowchart TD
    %% Internal Struct Styling
    classDef sys fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#e0e7ff,rx:8px,ry:8px;
    classDef inject fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#d1fae5,rx:8px,ry:8px;
    classDef llm fill:#4c1d95,stroke:#a855f7,stroke-width:3px,color:#f3e8ff,rx:8px,ry:8px;
    classDef out fill:#7f1d1d,stroke:#f87171,stroke-width:2px,color:#fee2e2,rx:8px,ry:8px;

    subgraph Core ["Llama-3.1 8B JSON Generation Pipe (aiService.ts)"]
        direction TB
        
        SysPrompt["System Prompt Template<br/>[Persona: 'Elite ATS Administrator']"]:::sys
        JSONSchema["JSON Schema Definition<br/>[Section-wise: Score, Match, Structure]"]:::sys
        
        CVText["Candidate Raw Text<br/>[String Buffer]"]:::inject
        JDText["Job Description<br/>[Target Requirements]"]:::inject
        CompositeScore["Composite ATS Score<br/>[Float: e.g. 78.4]"]:::inject
        
        SysPrompt --> Assembler
        JSONSchema --> Assembler
        CVText --> Assembler
        JDText --> Assembler
        CompositeScore --> Assembler
        
        Assembler{"Payload Assembler<br/>[NIM Request Body]"}:::sys
        
        Assembler --> NIM["NVIDIA NIM API Request<br/>Model: meta/llama-3.1-8b-instruct<br/>[Params: max_tokens=1024, response_format='json_object']"]:::llm
        
        NIM --> Fallback{"Timeout / Error Checker<br/>[try/catch mechanism]"}:::sys
        Fallback -- "Success" --> Parser["JSON.parse(response)"]:::out
        Fallback -- "Timeout" --> ErrorJSON["Fallback Error JSON Object<br/>[Hardcoded Structure]"]:::out
        
        Parser --> FinalData["Final Parsed Object<br/>[TypeScript Interface: {sections, overall_summary}]"]:::out
        ErrorJSON --> FinalData
    end`}
                            </div>
                        )}
                    </div>
                </section>

                {/* Additional Diagrams Section */}
                <section className="bg-slate-900 border border-indigo-500/10 rounded-xl overflow-hidden shadow-2xl mt-12 p-6">
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Comprehensive Process Diagrams</h2>
                    <p className="text-slate-400 text-sm mb-4">Explore detailed models including State Machines, Entity-Relationships, and Component architecture.</p>
                    <DiagramTabs diagrams={atsPipelineDiagrams} />
                </section>
            </div>
        </div>
    );
}
