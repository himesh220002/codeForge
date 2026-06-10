"use client";
import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";

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
                <a
                    href="/"
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 border border-indigo-700 text-sm font-medium rounded-lg transition-colors"
                >
                    Go Back Home
                </a>
            </header>

            {/* Sequence Flow */}
            <section className="p-6 border-b border-gray-800 bg-gray-900/50">
                <h2 className="text-2xl font-bold mb-4 text-slate-200">
                    Interactive RAG Lifecycle Flow (Dual-Stage Search)
                </h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto flex justify-center min-h-[550px]">
                    {ready && (
                        <div ref={ref} className="mermaid w-full">
                            {`sequenceDiagram
    autonumber
    actor User as User UI (Client)
    participant Express as Express Router (Server)
    participant Ctrl as Job Controller (Controller)
    participant Scraper as Hasjob Scraper (Service)
    participant DB as MongoDB Cache (Database)
    participant EmbedAPI as NVIDIA NIM Embed (API)
    participant RerankAPI as NVIDIA NIM Rerank (API)
    participant LLM as NVIDIA NIM Llama 3.3 (LLM)

    User->>Express: POST /api/jobs/match (CV + Prompt Criteria)
    Express->>Ctrl: matchJobsController()
    
    %% Stage 1: Live Scraping & Ingestion
    Ctrl->>Scraper: scrapeLatestJobsIndia()
    Scraper-->>Ctrl: Raw HTML/RSS Job Postings
    Ctrl->>DB: Query existing job links
    Ctrl->>EmbedAPI: Generate embeddings for new live postings (llama-nemotron-embed)
    EmbedAPI-->>Ctrl: Vector Arrays
    Ctrl->>DB: Cache new job postings with embeddings

    %% Stage 2: Embed Query & Retrieval
    Ctrl->>EmbedAPI: Generate query vector (CV + search prompt)
    EmbedAPI-->>Ctrl: Query Vector Array
    Ctrl->>DB: Fetch all job postings (CSV Seeded + Scraped)
    DB-->>Ctrl: Return job vectors
    Ctrl->>Ctrl: Local Cosine Similarity Matching (Threshold >= 20%)

    %% Stage 3: Reranking & Reconsideration
    Ctrl->>RerankAPI: Send query + top 20 semantic matches (llama-nemotron-rerank)
    RerankAPI-->>Ctrl: Re-ordered relevance rankings & logits
    Ctrl->>Ctrl: Sort by rerank score & slice top 5 target matches

    %% Stage 4: Strategy Generation
    Ctrl->>LLM: Generate strategy for top 5 matches (llama-3.3-70b)
    LLM-->>Ctrl: Outreach pitch, skill improvements & strategy Markdown
    
    Ctrl-->>Express: Return reranked jobs + strategy JSON
    Express-->>User: Render matches UI & Custom Strategy report`}
                        </div>
                    )}
                </div>
            </section>

            {/* Ingestion & Match Architecture Flowchart */}
            <section className="p-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto flex flex-col items-center min-h-[1100px]">
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
    classDef dbNode fill:#7f1d1d,stroke:#dc2626,stroke-width:2px,color:#fff;
    classDef uiNode fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;

    %% STAGE 1: OFFLINE CSV DATA INGESTION
    subgraph Offline_Ingestion_Pipeline [Stage 1: CSV Job Ingestion & Caching]
        csv_linkedin["final_data.csv<br>(LinkedIn dataset)"]:::fileNode
        csv_naukri["marketing_sample...csv<br>(Naukri dataset)"]:::fileNode
        
        script_seed["seedCsv.ts<br>(Parser Script)"]:::processNode
        
        chunk_jobs["Concatenated Passages<br>Title + Company + Description + Skills"]:::processNode
        
        model_embed_passage["NVIDIA NIM Model:<br>llama-nemotron-embed-1b-v2<br>(inputType: passage)"]:::modelNode
        
        response_passage_vectors["1024-Dimension Float Vectors<br>(embedding: number[])"]:::processNode
        
        db_mongo["MongoDB Database<br>(JobModel Cache)"]:::dbNode
    end

    csv_linkedin --> script_seed
    csv_naukri --> script_seed
    script_seed --> chunk_jobs
    chunk_jobs --"Generate Embeddings"--> model_embed_passage
    model_embed_passage --"Returns JSON: [0.12, -0.04, ...]"--> response_passage_vectors
    response_passage_vectors --"Save Document"--> db_mongo

    %% STAGE 2: REAL-TIME MATCHING PIPELINE
    subgraph Real_Time_RAG_Pipeline [Stage 2: CV Matching, Reranking & LLM Generation]
        user_input["User CV Text<br>+ Target Criteria / Preferences"]:::uiNode
        
        route_matcher["client/app/job-matcher/page.tsx<br>(Find Matches Click)"]:::uiNode
        
        controller_match["jobController.ts<br>(matchJobsController)"]:::processNode
        
        model_embed_query["NVIDIA NIM Model:<br>llama-nemotron-embed-1b-v2<br>(inputType: query)"]:::modelNode
        
        query_vector["1024-Dimension Query Vector"]:::processNode
        
        calculate_similarity["Local Cosine Similarity Search<br>(vecA • vecB) / (||vecA|| ||vecB||)"]:::processNode
        
        filter_threshold["Threshold Filter & Slice<br>Score >= 0.20 (20% Match)<br>Max 10-20 Semantic Matches"]:::processNode
        
        model_rerank["NVIDIA NIM Model:<br>nvidia/llama-nemotron-rerank-1b-v2<br>(inputType: query + passages)"]:::modelNode
        
        reranked_results["Reranked Jobs List<br>(Sorted by Logit Scores)"]:::processNode
        
        slice_top_5["Slice Top 5 Best Targets<br>(Context Compression)"]:::processNode
        
        model_deepseek["NVIDIA NIM Model:<br>meta/llama-3.3-70b-instruct<br>(with DeepSeek fallback)"]:::modelNode
        
        response_strategy["Custom Strategy Output:<br>1. Outreach pitch for top 5<br>2. Skill improvements & gaps<br>3. Channel advice"]:::processNode
        
        render_ui["Job Matcher UI Cards<br>10-20 Job Listings + Strategy Markdown"]:::uiNode
    end

    %% CONNECTIONS BETWEEN INGESTION AND RAG
    db_mongo --"Fetch Job Vectors"--> calculate_similarity
    
    user_input --> route_matcher
    route_matcher --"POST /api/jobs/match"--> controller_match
    
    controller_match --"Combine CV + Preferences"--> model_embed_query
    model_embed_query --"Returns 1024-Dim Array"--> query_vector
    query_vector --> calculate_similarity
    
    calculate_similarity --> filter_threshold
    filter_threshold --"Send Query + 20 Passages"--> model_rerank
    model_rerank --"Returns logit ratings"--> reranked_results
    
    reranked_results --> slice_top_5
    slice_top_5 --"Send Compressed Context"--> model_deepseek
    model_deepseek --"Returns Markdown text"--> response_strategy
    
    response_strategy --> render_ui
    reranked_results --> render_ui

    style Offline_Ingestion_Pipeline fill:#0f172a,stroke:#475569,stroke-width:1px
    style Real_Time_RAG_Pipeline fill:#0f172a,stroke:#475569,stroke-width:1px`}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
