"use client";
import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import Link from "next/link";
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Play, Server, Database } from "lucide-react";

export default function AtsPipelinePage() {
    const diagramRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    

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
        if (ready && diagramRef.current) {
            mermaid.run({ nodes: [diagramRef.current] });
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
                <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                            <Server className="text-indigo-400" /> Pipeline Architecture Mapping
                        </h2>
                        <p className="text-slate-400 text-sm max-w-4xl leading-relaxed">
                            This diagram maps out every technical step, micro-decision, and database event needed to build an in-house, enterprise-ready resume screening system. It relies entirely on free, open-source python libraries, ChromaDB, and NVIDIA’s free tier open-weight models (NVIDIA NIM).
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
                            <span className="px-3 py-1 bg-green-900/50 border border-green-800 text-green-300 rounded-full">ChromaDB Vector Store</span>
                            <span className="px-3 py-1 bg-blue-900/50 border border-blue-800 text-blue-300 rounded-full">NVIDIA NIM (NV-Embed-QA)</span>
                            <span className="px-3 py-1 bg-purple-900/50 border border-purple-800 text-purple-300 rounded-full">Python (spaCy / PyMuPDF)</span>
                            <span className="px-3 py-1 bg-orange-900/50 border border-orange-800 text-orange-300 rounded-full">Scikit-Learn Algorithms</span>
                            <span className="px-3 py-1 bg-indigo-900/50 border border-indigo-800 text-indigo-300 rounded-full">NVIDIA Llama-3 Insight Engine</span>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-950 overflow-x-auto min-h-[500px] flex justify-center">
                        {ready && (
                            <div ref={diagramRef} className="mermaid w-full flex justify-center max-w-[1200px]">
                                {`flowchart TD
    %% Global Styling Declarations
    classDef ingestion fill:#0c4a6e,stroke:#0284c7,stroke-width:2px,color:#e0f2fe;
    classDef extraction fill:#4a044e,stroke:#c084fc,stroke-width:2px,color:#fae8ff;
    classDef processing fill:#422006,stroke:#eab308,stroke-width:2px,color:#fef9c3;
    classDef vector fill:#052e16,stroke:#22c55e,stroke-width:2px,color:#dcfce7;
    classDef scoring fill:#431407,stroke:#f97316,stroke-width:2px,color:#ffedd5;
    classDef output fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#fee2e2;
    classDef feedback fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#e0e7ff;

    subgraph P1 [Phase 1: Ingestion & Document Normalization]
        A1[Raw Candidate Resumes <br/><i>.pdf, .docx, .txt</i>] --> A2[Python PyMuPDF / python-docx]
        B1[Raw Job Description <br/><i>HR Requisition Text</i>] --> B2[Text Sanitization Pipe]
        
        A2 --> A3[Raw Text Extraction Stream]
        B2 --> B3[Standardized JD Text String]
        
        A3 --> A4[Regex-Based Structural Splitter]
        A4 --> A5["Segment Text Blocks <br/><i>(Contact, Experience, Skills, Education)</i>"]
    end
    class A1,A2,A3,A4,A5,B1,B2,B3 ingestion;

    subgraph P2 [Phase 2: Hybrid NLP Tokenization & Entity Extraction]
        A5 --> C1[spaCy NLP Pipeline <br/><i>en_core_web_trf Model</i>]
        B3 --> C1
        
        C1 --> C2[Named Entity Recognition - NER]
        C2 --> D1["Extract Entities <br/><i>ORG (Companies), ORG (Schools), DATE</i>"]
        
        C1 --> C3[Custom PhraseMatcher / Token Rules]
        C3 --> D2["Extract Tech Stack & Competencies <br/><i>(e.g., Python, Kubernetes, AWS)</i>"]
        
        C1 --> C4[Dependency Parsing / POS Tagging]
        C4 --> D3["Isolate Action Verbs + Metrics <br/><i>(e.g., 'Managed team of 5', 'Increased sales 20%')</i>"]
    end
    class C1,C2,C3,C4,D1,D2,D3 extraction;

    subgraph P3 [Phase 3: Deep Semantic Vector Embedding]
        D1 & D2 & D3 --> E1[Text Chunking & Prompt Template Assembly]
        E1 --> E2["NVIDIA NIM API Request <br/><i>(Using Free API Key Developer Tier)</i>"]
        
        E2 --> E3["Model: nvidia/nv-embedqa-e5-v5 <br/><i>(High-Dimensional Dense Vectors)</i>"]
        
        E3 --> F1["Generate 1024-Dimension Float Vector <br/><i>for Resume Text Chunks</i>"]
        B3 --> E2 --> F2["Generate 1024-Dimension Float Vector <br/><i>for Job Description Core requirements</i>"]
    end
    class E1,E2,E3,F1,F2 vector;

    subgraph P4 [Phase 4: Open-Source Vector Storage Management]
        F1 --> G1[ChromaDB Local Vector Client]
        G1 --> G2["Initialize Persistent Collection <br/><i>collection = client.get_or_create_collection</i>"]
        
        G2 --> G3["Upsert Data Payload <br/><i>ids = [candidate_id]<br/>embeddings = [F1_Vectors]<br/>metadatas = [{skills, experience_years, role}]</i>"]
    end
    class G1,G2,G3 processing;

    subgraph P5 [Phase 5: Multi-Dimensional Scoring Engine]
        G3 --> H1[Vector Query Execution]
        F2 --> H1 --> H2["ChromaDB Distance Match <br/><i>(Calculate Cosine Distance)</i>"]
        
        H2 --> I1["Component Score A: Semantic Match Score <br/><i>(Calculated as: 1 - Cosine Distance)</i>"]
        
        D2 & D3 --> J1[Scikit-Learn Text Processing Engine]
        J1 --> J2["TF-IDF Vectorizer Matrix <br/><i>(Compute Term Frequency-Inverse Document Frequency)</i>"]
        J2 --> I2["Component Score B: Hard Keyword Match <br/><i>(Exact match overlay vs JD terms via Cosine Similarity)</i>"]
        
        D1 --> K1[Rule-Based Heuristic Evaluation]
        K1 --> K2["Calculate Total Years of Experience <br/><i>(via date-span duration delta calculations)</i>"]
        K2 --> I3["Component Score C: Hard Filter Check <br/><i>(Knockout criteria: Visa, Experience, Location)</i>"]
    end
    class H1,H2,I1,I2,I3,J1,J2,K1,K2 scoring;

    subgraph P6 [Phase 6: Candidate Rank Synthesis & UI Feed]
        I1 & I2 & I3 --> L1[Weighted Formula Execution Engine]
        L1 --> L2["Final Composite ATS Score Calculation <br/><i>Score = (0.50 * Vector) + (0.30 * TF-IDF) + (0.20 * Rule)</i>"]
        
        L2 --> L3[If Hard Filter Score C == 0 --> Auto-Flag for Human Review / Archive]
        L2 --> M1[Sort Array in Descending Order]
        
        M1 --> M2["Final Ranked Applicant JSON Data Feed <br/><i>[ {id: 001, score: 94.2%}, {id: 042, score: 88.7%} ]</i>"]
    end
    class L1,L2,L3,M1,M2 output;

    subgraph P7 [Phase 7: AI Gap-Analysis & Actionable Optimization Engine]
        M2 --> N1["Initialize LLM Diagnostics API <br/><i>(NVIDIA NIM: meta/llama-3.1-70b-instruct)</i>"]
        B3 --> N2["Inject JSON System Prompt Template <br/><i>'Act as a cynical lead corporate recruiter...'</i>"]
        
        N1 & N2 --> N3["Execute Core Comparison Prompt Matrix <br/><i>Inputs: Raw Resume Strings + Extracted Entities + Target JD Text</i>"]
        
        N3 --> O1["Sub-Step 7.1: Missing Hard-Skills Audit <br/><i>Identifies vital acronyms/tools in JD but totally absent in resume</i>"]
        N3 --> O2["Sub-Step 7.2: Semantic Context Gap Check <br/><i>Flags weak phrasing (e.g., 'helped with data' vs 'built pipelines')</i>"]
        N3 --> O3["Sub-Step 7.3: Chronological & Metric Audit <br/><i>Flags career timeline anomalies and bullet points lacking raw numerical data</i>"]
        
        O1 & O2 & O3 --> P1["Compile Live Candidate Optimization Payload <br/><i>JSON Format Output via Pydantic Structuring</i>"]
        
        P1 --> P2["Render Prioritization Dashboard View <br/><i>1. Current Target Match Score<br/>2. Red-Flag Gaps to Resolve<br/>3. Ready-to-Insert Phrasing Suggestions</i>"]
    end
    class N1,N2,N3,O1,O2,O3,P1,P2 feedback;

    A5 -.->|Extracted Text Buffers| C1
    D2 -.->|Parsed Tokens| J1
    D1 -.->|Parsed Dates| K1
    M2 -->|Feed Live Ranking Array| N1`}
                            </div>
                        )}
                    </div>

                    {/* Explanatory Footer inside architecture box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900 border-t border-slate-800">
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                            <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                                <Database size={16} className="text-yellow-400"/> 1. Ingestion & NLP Parsing
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Uses Python's <b>PyMuPDF</b> for high-accuracy raw layout text extractions. It feeds text chunks straight to <b>spaCy (en_core_web_trf)</b> transformer pipeline to clean up and extract named entities, explicit dates, and structural resume segments.
                            </p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                            <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                                <Server size={16} className="text-green-400"/> 2. Vector Embeddings & DB
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Chunks are sent via standard API requests to <b>NVIDIA NIM</b> calling the open-weight <b>nvidia/nv-embedqa-e5-v5</b> model. Resulting high-dimensional vectors are stored instantly inside a local, file-persisted instance of <b>ChromaDB</b>.
                            </p>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                            <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                                <CheckCircle size={16} className="text-orange-400"/> 3. Hybrid Scoring Blend
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Calculates ranking using three vectors: 50% Dense Vector semantic matching, 30% <b>Scikit-Learn TF-IDF</b> exact keyword mapping matrix overlays, and 20% deterministic rule-based checks (knockout questions and exact domain experience time calculations).
                            </p>
                        </div>
                    </div>
                </section>


            </div>
        </div>
    );
}
