export const aiJobSearchDiagrams = [
  {
    id: "class",
    title: "Class Diagram",
    content: `classDiagram
  class CandidateUser {
    +String cvText
    +String jobPrompt
    +submitRequest()
  }
  class JobEmbedder {
    +NVIDIA_NIM_API
    +float[] embedText(text)
  }
  class ChromaVectorStore {
    +saveVector(id, vector)
    +query(vector, topK)
  }
  class LLMEngine {
    +NVIDIA_LLAMA_3
    +String generateStrategy(context)
  }
  CandidateUser --> JobEmbedder : Uses
  JobEmbedder --> ChromaVectorStore : Feeds
  ChromaVectorStore --> LLMEngine : Provides Context`
  },
  {
    id: "er",
    title: "ER Diagram",
    content: `erDiagram
    USER ||--o{ SEARCH_QUERY : submits
    SEARCH_QUERY ||--|{ VECTOR_EMBEDDING : generates
    JOB_POSTING ||--|| VECTOR_EMBEDDING : has
    VECTOR_EMBEDDING }|--|| CHROMA_DB : stored_in
    USER {
        string session_id
        string cv_text
    }
    SEARCH_QUERY {
        string prompt
        timestamp time
    }
    JOB_POSTING {
        string title
        string description
    }`
  },
  {
    id: "component",
    title: "Component Diagram",
    content: `flowchart TD
    UI[Next.js Client UI] --> Proxy[Next.js API Proxy]
    Proxy --> Controller{Express Controller}
    Controller --> NIM_Embed((NVIDIA Embed API))
    Controller --> Chroma[(ChromaDB )]
    Controller --> NIM_LLM((NVIDIA Llama API))`
  },
  {
    id: "deployment",
    title: "Deployment Diagram",
    content: `flowchart TD
    subgraph Vercel[Vercel Cloud]
        Client((Browser User)) --> NextJS[Next.js Frontend Edge]
    end
    subgraph Render[Render Cloud]
        NextJS --> ExpressServer[Express Node.js Backend]
    end
    subgraph External[External Services]
        ExpressServer --> NVIDIA((NVIDIA NIM API))
        ExpressServer --> ChromaDB[(Chroma Vector DB)]
        ExpressServer --> MongoDB[(MongoDB Cluster)]
    end`
  },
  {
    id: "state",
    title: "State Machine",
    content: `stateDiagram-v2
    [*] --> Idle
    Idle --> Vectorizing : Submit CV
    Vectorizing --> QueryingChroma : Embeddings Ready
    QueryingChroma --> Reranking : Matches Found
    Reranking --> GeneratingStrategy : Top 5 Filtered
    GeneratingStrategy --> Complete : Streamed
    Complete --> [*]`
  },
  {
    id: "activity",
    title: "Activity Diagram",
    content: `flowchart TD
    Start([Start]) --> UploadCV[/Upload CV/]
    UploadCV --> Embed{Vectorize }
    Embed -- Success --> Query[(Query DB )]
    Embed -- Fail --> Error[/Show Error/]
    Query --> Rerank[Rerank]
    Rerank --> LLM{Generate Strategy?}
    LLM -- Yes --> Out[/Stream UI/]
    LLM -- No --> JustJobs[Show Jobs]
    Out --> End(((End)))
    JustJobs --> End`
  },
  {
    id: "usecase",
    title: "Use Case Diagram",
    content: `flowchart LR
    Candidate((Candidate)) --> SubmitCV([Submit CV])
    Candidate --> ViewStrategy([View Strategy])
    Admin((Admin)) --> SeedDB([Seed DB])
    SubmitCV -.-> GenerateVectors([Generate Vectors])`
  },
  {
    id: "dfd",
    title: "Data Flow Diagram",
    content: `flowchart TD
    User((User)) -- "Raw CV" --> Process1[1.0 Vectorize Input]
    Process1 -- "1024-dim Vector" --> Process2[2.0 Vector Search]
    DB1[(Chroma DB )] -- "Indexed Vectors" --> Process2
    Process2 -- "Top 30 Matches" --> Process3[3.0 Neural Rerank]
    Process3 -- "Top 5" --> Process4[4.0 Strategy Gen]
    Process4 -- "Final Report" --> User`
  },
  {
    id: "network",
    title: "Network Topology",
    content: `flowchart TD
    Internet((Internet Users)) --- LB{Load Balancer }
    LB --- Web1[Next.js Node 1]
    LB --- Web2[Next.js Node 2]
    Web1 --- API[Render Backend API]
    Web2 --- API
    API --- VPC{Secure VPC Network}
    VPC --- DB[(MongoDB )]
    API --- NVIDIA((NVIDIA NIM Cloud))`
  },
  {
    id: "swimlane",
    title: "Sequence + Swimlane",
    content: `sequenceDiagram
    participant C as Candidate (User)
    participant F as Frontend (UI)
    participant B as Backend (Express)
    participant AI as AI Engine (NVIDIA)
    C->>F: Enter Details
    F->>B: API Request
    B->>AI: Vectorize Request
    AI-->>B: Return Vectors
    B->>F: Stream UI Updates`
  },
  {
    id: "c4",
    title: "C4 Context Diagram",
    content: `flowchart TD
    User((Candidate))
    System[AI Job Search System]
    ExtAI[NVIDIA NIM Cloud]
    ExtDB[(Chroma Vector DB)]
    
    User -- "Uploads CV & Searches Jobs" --> System
    System -- "Requests Embeddings & Reranking" --> ExtAI
    System -- "Queries Nearest Neighbors" --> ExtDB`
  },
  {
    id: "eventstorming",
    title: "Event Storming",
    content: `flowchart LR
    subgraph Command
        C1[Submit Search Request]
    end
    subgraph Aggregate
        A1[(Job Search Aggregate)]
    end
    subgraph Event
        E1[/Search Request Received/]
        E2[/CV Vectorized/]
        E3[/Nearest Jobs Found/]
        E4[/Strategy Generated/]
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
    API[Backend API]
    EmbedSvc[Embedding Microservice]
    RerankSvc[Reranking Microservice]
    LLMSvc[Llama Strategy Microservice]
    Chroma[(Chroma DB)]
    
    API -->|Downstream Call| EmbedSvc
    API -->|Downstream Call| RerankSvc
    API -->|Downstream Call| LLMSvc
    EmbedSvc -.->|Network Dependency| Chroma
    API -.->|Network Dependency| Chroma`
  },
  {
    id: "sequenceapi",
    title: "API Contracts",
    content: `sequenceDiagram
    participant UI as Client
    participant API as Server
    
    Note over UI,API: Req: POST /match {cvText, prompt}
    UI->>API: HTTP POST
    Note over API: Res: 200 OK
    Note over API: Streaming JSON Chunks
    API-->>UI: Chunk {type: "vectorizing"}
    API-->>UI: Chunk {type: "jobs", data: [...]}
    API-->>UI: Chunk {type: "strategy", data: "MD..."}`
  },
  {
    id: "bpmn",
    title: "BPMN Workflow",
    content: `flowchart TD
    Start((Start)) --> Task1[Task: Parse CV]
    Task1 --> Gateway{Exclusive Gateway}
    Gateway -- Success --> Task2[Task: Call NVIDIA]
    Gateway -- Fail --> EndEvent1(((Error End)))
    Task2 --> Task3[Task: Render UI]
    Task3 --> EndEvent2(((Normal End)))`
  },
  {
    id: "adr",
    title: "ADR Decision Tree",
    content: `flowchart TD
    Context[/Context: We need semantic job matching/]
    Decision{Decision: Use ChromaDB vs PGVector?}
    Opt1[Option: PGVector]
    Opt2[Option: ChromaDB Cloud]
    Context --> Decision
    Decision -.-> Opt1
    Decision -.-> Opt2
    Opt2 --> Chosen[/Status: Accepted ChromaDB due to built-in HNSW & local dev ease/]`
  },
  {
    id: "threat",
    title: "Threat Model",
    content: `flowchart TD
    Actor((Attacker)) -->|Injection| Input[/Job Prompt/]
    Input --> Boundary{Trust Boundary}
    Boundary --> API[Node.js Server]
    API -->|Mitigation: Sanitize| LLM((NVIDIA Prompt))
    API -.->|Data Leak Risk| Chroma[(Vector DB)]`
  },
  {
    id: "syscontext",
    title: "System Context",
    content: `flowchart TD
    User((Job Seeker))
    BlackBox[AI Matcher Black Box]
    DB[(Internal Job DB)]
    
    User -- Inputs CV --> BlackBox
    BlackBox -- Outputs Strategy --> User
    BlackBox <--> DB`
  }
];
