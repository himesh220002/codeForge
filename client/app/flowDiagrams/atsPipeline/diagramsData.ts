export const atsPipelineDiagrams = [
  {
    id: "class",
    title: "Class Diagram",
    content: `classDiagram
  class CVParser {
    +String rawText
    +parseText()
    +extractEntities()
  }
  class ScorerEngine {
    +calculateDenseVectors()
    +calculateSparseTFIDF()
    +applyHeuristics()
    +float finalScore
  }
  class LlamaInsightEngine {
    +String sysPrompt
    +generateFeedbackJSON()
  }
  CVParser --> ScorerEngine : Sends Chunks
  ScorerEngine --> LlamaInsightEngine : Sends Match Data`
  },
  {
    id: "er",
    title: "ER Diagram",
    content: `erDiagram
    CANDIDATE ||--|| CV_DOCUMENT : owns
    CV_DOCUMENT ||--|{ CV_SECTION : split_into
    CV_SECTION ||--o| ATS_SCORE : evaluated_as
    CANDIDATE {
        string email
        string name
    }
    CV_DOCUMENT {
        buffer pdf_data
        string parsed_text
    }
    ATS_SCORE {
        float dense_score
        float tfidf_score
        string json_feedback
    }`
  },
  {
    id: "component",
    title: "Component Diagram",
    content: `flowchart TD
    UI[Frontend Client] --> Pipeline{ATS Pipeline }
    Pipeline --> PDF[pdf-parse Module]
    Pipeline --> NLP[compromise NLP Module]
    Pipeline --> Embed((NVIDIA nv-embedqa))
    Pipeline --> Math[/Cosine Math/]
    Math --> LLM((Llama Engine))`
  },
  {
    id: "deployment",
    title: "Deployment Diagram",
    content: `flowchart TD
    subgraph Vercel[Vercel Edge]
        NextUI([Client App])
    end
    subgraph Render[Render Backend Server]
        NextUI --> ATSEngine[ATS Processing Engine]
    end
    subgraph AI[External Clouds]
        ATSEngine --> NVIDIA((NVIDIA NIM APIs))
        ATSEngine --> DB[(MongoDB )]
    end`
  },
  {
    id: "state",
    title: "State Machine",
    content: `stateDiagram-v2
    [*] --> Uploaded
    Uploaded --> Parsing : Extract PDF
    Parsing --> NLPAnalysis : Extract Entities
    NLPAnalysis --> Vectorizing : Call NVIDIA
    Vectorizing --> Scoring : Local Math
    Scoring --> AI_Evaluating : Call Llama
    AI_Evaluating --> Finalized : JSON Ready
    Finalized --> [*]`
  },
  {
    id: "activity",
    title: "Activity Diagram",
    content: `flowchart TD
    Start([Start Upload]) --> Parse[/Read Buffer/]
    Parse --> Success{Extracted Text? }
    Success -- Yes --> NLP[Compromise Analysis]
    Success -- No --> Error(((Error)))
    NLP --> Chunks[/Text Chunks/]
    Chunks --> Vec[(Generate Vectors )]
    Vec --> Score{Score > Threshold? }
    Score -- Yes --> Generate[Get Feedback]
    Score -- No --> Reject[Auto Reject]
    Generate --> End([End])
    Reject --> End`
  },
  {
    id: "usecase",
    title: "Use Case Diagram",
    content: `flowchart LR
    HR((HR Admin)) --> Upload([Upload Resumes])
    HR --> View([View ATS Match Grid])
    System((System User)) --> Parse([Auto Parse Text])
    System -.-> CallAI([Call NVIDIA API])`
  },
  {
    id: "dfd",
    title: "Data Flow Diagram",
    content: `flowchart TD
    HR((HR)) -- "PDF File" --> Process1[1.0 Text Extraction]
    Process1 -- "Raw String" --> Process2[2.0 NLP Tagging]
    Process2 -- "Entities" --> Process3[3.0 Embedding Gen]
    NVIDIA((NVIDIA)) -- "Float Array" --> Process3
    Process3 -- "Match Data" --> Process4[4.0 Strategy Eval]
    Process4 -- "Final JSON" --> DB[(Database )]`
  },
  {
    id: "network",
    title: "Network Topology",
    content: `flowchart TD
    User((HR User)) --- HTTPS{TLS Gateway }
    HTTPS --- App[Web Server Node]
    App --- VNET{Virtual Network}
    VNET --- Model((NVIDIA API Endpoint))
    VNET --- DB[(Primary Database )]`
  },
  {
    id: "swimlane",
    title: "Sequence + Swimlane",
    content: `sequenceDiagram
    participant HR as HR Interface
    participant ATS as ATS Core
    participant Math as Scoring Engine
    participant NIM as NVIDIA AI
    HR->>ATS: Upload Candidate PDF
    ATS->>ATS: parse-pdf & compromise NLP
    ATS->>NIM: Send Chunks for Vectorizing
    NIM-->>Math: Return Float32Array[1024]
    Math->>Math: Cosine Similarity & TF-IDF
    Math->>NIM: Request AI Gap Analysis
    NIM-->>HR: Stream ATS Summary Grid`
  },
  {
    id: "c4",
    title: "C4 Context Diagram",
    content: `flowchart TD
    User((HR Manager))
    System[ATS Resume Processing System]
    ExtAI[NVIDIA Llama Cloud]
    ExtJobBoard[External Job Boards]
    
    User -- "Uploads resumes & views scoring" --> System
    System -- "Offloads compute & generation" --> ExtAI
    System -- "Pulls JD baseline metrics" --> ExtJobBoard`
  },
  {
    id: "eventstorming",
    title: "Event Storming",
    content: `flowchart LR
    subgraph Command
        C1[Trigger Parse Job]
    end
    subgraph Aggregate
        A1[(ATS Pipeline Context)]
    end
    subgraph Event
        E1[/Job Created/]
        E2[/PDF Parsed to String/]
        E3[/Embeddings Calculated/]
        E4[/Final Score Assigned/]
    end
    C1 --> A1
    A1 --> E1
    E1 --> E2
    E2 --> E3
    E3 --> E4`
  },
  {
    id: "servicedep",
    title: "Service Dependencies",
    content: `flowchart TD
    API[ATS Main API]
    NLPWorker[Node NLP Worker]
    VectorNode[In-Memory Math Worker]
    LlamaNode[Llama Output Worker]
    
    API --> NLPWorker
    NLPWorker --> VectorNode
    VectorNode --> LlamaNode
    VectorNode -.-> |Dependency| NVIDIA_Embed
    LlamaNode -.-> |Dependency| NVIDIA_Gen`
  },
  {
    id: "sequenceapi",
    title: "API Contracts",
    content: `sequenceDiagram
    participant UI as Next.js Client
    participant API as Server API
    
    Note over UI,API: Req: POST /ats {file: PDF, jd: text}
    UI->>API: HTTP Multipart POST
    Note over API: Res: 200 OK Chunked
    API-->>UI: Chunk {status: "parsing"}
    API-->>UI: Chunk {status: "scoring", score: 85}
    API-->>UI: Chunk {status: "complete", feedback: "..."}`
  },
  {
    id: "bpmn",
    title: "BPMN Workflow",
    content: `flowchart TD
    Start((Start)) --> Task1[Task: Extract Text via pdf-parse]
    Task1 --> Task2[Task: NLP Tagging via compromise]
    Task2 --> Gateway{Quality Gateway}
    Gateway -- "Valid Text" --> Task3[Task: Cosine Sim Math]
    Gateway -- "Corrupted PDF" --> EndEvent1(((Reject Candidate)))
    Task3 --> EndEvent2(((Score Recorded)))`
  },
  {
    id: "adr",
    title: "ADR Decision Tree",
    content: `flowchart TD
    Context[/Context: We need to score resumes/]
    Decision{Decision: Dense vs Sparse Vectors?}
    Opt1[Option: Dense Vectors Only]
    Opt2[Option: TF-IDF Only]
    Opt3[Option: Hybrid Search]
    Context --> Decision
    Decision -.-> Opt1
    Decision -.-> Opt2
    Decision -.-> Opt3
    Opt3 --> Chosen[/Status: Accepted Hybrid Approach due to keyword importance in ATS/]`
  },
  {
    id: "threat",
    title: "Threat Model",
    content: `flowchart TD
    Actor((Attacker)) -->|Malicious PDF Payload| Input[/Resume File/]
    Input --> Boundary{PDF Parser Boundary}
    Boundary --> API[pdf-parse Engine]
    API -->|Mitigation: Memory Limits & Strip Scripts| SafeText((Clean Text))
    SafeText -.-> Pipeline[ATS Math Engine]`
  },
  {
    id: "syscontext",
    title: "System Context",
    content: `flowchart TD
    HR((Recruiting Team))
    BlackBox[Hybrid Scoring Core]
    JD[(Company JD Repo)]
    
    HR -- Provides PDF Resumes --> BlackBox
    BlackBox -- Generates Actionable Insights --> HR
    BlackBox <--> JD`
  }
];
