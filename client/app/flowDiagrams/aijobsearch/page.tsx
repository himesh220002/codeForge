"use client";
import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import Link from "next/link";
import DiagramTabs from "@/components/DiagramTabs";
import { aiJobSearchDiagrams } from "./diagramsData";

export default function AIJobSearchFlowPage() {
    const ref = useRef<HTMLDivElement>(null);
    const repoRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
                background: "#0f172a",
                primaryColor: "#1e293b",
                primaryTextColor: "#f8fafc",
                lineColor: "#6366f1",
            },
        });
        setReady(true);
    }, []);

    useEffect(() => {
        if (ready) {
            if (ref.current) mermaid.run({ nodes: [ref.current] });
            if (repoRef.current) mermaid.run({ nodes: [repoRef.current] });
        }
    }, [ready]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
            {/* Title Header */}
            <header className="p-6 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AI Job Matcher RAG Pipeline Architecture
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Comprehensive processing maps showing vectorization, local search, reranking, and LLM output streams.
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 border border-indigo-700 text-sm font-medium rounded-lg transition-colors"
                >
                    Go Back Home
                </Link>
            </header>

            {/* Sequence Flow */}
            <section className="p-6 border-b border-gray-800 bg-gray-900/50">
                <h2 className="text-2xl font-bold mb-4 text-slate-200">
                    Interactive RAG Lifecycle Flow (Dual-Stage Search)
                </h2>
                <div className="bg-slate-900 border border-indigo-500/10 rounded-xl p-4 overflow-x-auto flex justify-center min-h-[550px]">
                    {ready && (
                        <div ref={ref} className="mermaid w-full">
                            {`sequenceDiagram
    autonumber
    actor User as User UI (Client)
    participant Express as Express Router (Server)
    participant Ctrl as Job Controller (Controller)
    participant EmbedAPI as NVIDIA NIM Embed (API)
    participant Chroma as ChromaDB Cloud (Vector DB)
    participant RerankAPI as NVIDIA NIM Rerank (API)
    participant LLM as NVIDIA NIM Llama 3.3 (LLM)

    User->>Express: POST /api/jobs/match (CV + Prompt Criteria)
    Express->>Ctrl: matchJobsController()
    
    %% Stage 1: Embed Query Vector
    Ctrl->>EmbedAPI: Generate query vector (CV + search prompt) via llama-nemotron-embed
    EmbedAPI-->>Ctrl: 1024-Dimension Float Array
    
    %% Stage 2: Native Vector Search
    Ctrl->>Chroma: Native HNSW Cosine Distance Query (Top 30 matches)
    Chroma-->>Ctrl: Return semantic matches & distance scores

    %% Stage 3: AI Reranking & Scoring
    Ctrl->>RerankAPI: Send query + top 30 semantic matches (llama-nemotron-rerank)
    RerankAPI-->>Ctrl: Re-ordered relevance rankings & raw logits
    Ctrl->>Ctrl: Min-Max scale logits to 55%-98% probabilities
    
    %% Stream partial results
    Ctrl-->>Express: Stream JSON partial_result (Instant render matches)

    %% Stage 4: Custom Application Strategy
    Ctrl->>Ctrl: Slice Top 5 Targets
    Ctrl->>LLM: Draft outreach pitches & skills gap analysis (meta/llama-3.3-70b-instruct)
    LLM-->>Ctrl: Strategy Markdown JSON
    
    Ctrl-->>Express: Stream JSON result (Final strategy report)
    Express-->>User: Render strategy report in background`}
                        </div>
                    )}
                </div>
            </section>

            {/* Ingestion & Match Architecture Flowchart */}
            <section className="p-6">
                <div className="bg-slate-900 border border-indigo-500/10 rounded-xl p-6 overflow-x-auto flex flex-col items-center min-h-[1100px]">
                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                        Complete Pipeline Processing & Data Conversion Map
                    </h3>
                    <p className="text-gray-400 text-sm mb-8 text-center max-w-2xl">
                        A detailed view of how CSV datasets are parsed, how text features are chunked, how embeddings are generated and stored, and how vector search, reranking, and generation occurs.
                    </p>

                    {ready && (
                        <div ref={repoRef} className="mermaid w-full">
                            {`flowchart TD
    classDef fileNode fill:#334155,stroke:#475569,stroke-width:2px,color:#fff;
    classDef processNode fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef modelNode fill:#4c1d95,stroke:#7c3aed,stroke-width:2px,color:#fff;
    classDef dbNode fill:#ea580c,stroke:#c2410c,stroke-width:2px,color:#fff;
    classDef uiNode fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;

    %% INGESTION DOMAIN
    subgraph Ingestion_Group [Data Ingestion & Vectorization Domain]
        direction TB
        csv_linkedin["final_data.csv (LinkedIn)"]:::fileNode
        csv_naukri["marketing_sample...csv (Naukri)"]:::fileNode
        script_seed["seedCsv.ts (Dynamic Link Generator)"]:::processNode
        model_embed_passage["NVIDIA NIM: llama-nemotron-embed"]:::modelNode
        response_passage_vectors["1024-Dimension Embedded Float Vectors"]:::processNode
        db_chroma["ChromaDB Cloud Cluster (RAG Vector Store)"]:::dbNode
    end

    %% RETRIEVAL DOMAIN
    subgraph Retrieval_Group [Semantic Retrieval Domain]
        direction TB
        user_input["User CV Text + Job Preferences"]:::uiNode
        model_embed_query["NVIDIA NIM: llama-nemotron-embed (Query Mode)"]:::modelNode
        query_vector["User Query Vector Array"]:::processNode
        calculate_similarity["ChromaDB Native HNSW Vector Query (Cosine Distance)"]:::processNode
    end

    %% AUGMENTATION DOMAIN
    subgraph Augmentation_Group [AI Augmentation & Reranking Domain]
        direction TB
        model_rerank["NVIDIA NIM: nvidia/llama-nemotron-rerank-1b-v2"]:::modelNode
        reranked_results["Min-Max Probability Scaled Job Matches (55%-98%)"]:::processNode
    end

    %% GENERATION DOMAIN
    subgraph Generation_Group [Strategy Generation & Output Domain]
        direction TB
        model_deepseek["NVIDIA NIM: meta/llama-3.3-70b-instruct"]:::modelNode
        response_strategy["Custom Strategy Output:<br>1. Outreach pitch<br>2. Skill gaps"]:::processNode
        route_matcher["Job Matcher React UI (Instant Partial Streaming)"]:::uiNode
    end

    csv_linkedin --> script_seed
    csv_naukri --> script_seed
    script_seed --"Extract Text Features"--> model_embed_passage
    model_embed_passage --"Return Vectors"--> response_passage_vectors
    response_passage_vectors --"Batch Upsert"--> db_chroma

    user_input --> model_embed_query
    model_embed_query --> query_vector
    db_chroma --"Top 30 Pre-Indexed Vectors"--> calculate_similarity
    query_vector --"Search Against DB"--> calculate_similarity

    calculate_similarity --"Retrieve Top 30 Matches"--> model_rerank
    model_rerank --"Return Contextual Logits"--> reranked_results

    reranked_results --"Stream Match Grid instantly"--> route_matcher
    reranked_results --"Slice Top 5 for LLM Context"--> model_deepseek
    model_deepseek --"Generate Markdown Report"--> response_strategy
    response_strategy --"Stream Final UI Report"--> route_matcher

    style Ingestion_Group fill:#0f172a,stroke:#475569,stroke-width:1px
    style Retrieval_Group fill:#0f172a,stroke:#475569,stroke-width:1px
    style Augmentation_Group fill:#0f172a,stroke:#475569,stroke-width:1px
    style Generation_Group fill:#0f172a,stroke:#475569,stroke-width:1px`}
                        </div>
                    )}
                </div>
            </section>

            {/* Additional Diagrams Section */}
            <section className="p-6">
                <h2 className="text-2xl font-bold text-slate-200 mb-2">Comprehensive Process Diagrams</h2>
                <p className="text-gray-400 text-sm mb-4">Explore various architectural and behavioral diagrams representing the entire RAG pipeline process.</p>
                <DiagramTabs diagrams={aiJobSearchDiagrams} />
            </section>
        </div>
    );
}
