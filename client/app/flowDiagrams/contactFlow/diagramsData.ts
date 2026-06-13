export const contactFlowDiagrams = [
  {
    id: "class",
    title: "Class Diagram",
    content: `classDiagram
  class ContactController {
    +Request req
    +Response res
    +createContactController()
  }
  class ContactModel {
    +String name
    +String email
    +String message
    +Date timestamp
    +save()
  }
  class Database {
    +connect()
  }
  ContactController --> ContactModel : Instantiates
  ContactModel --> Database : Saves Data`
  },
  {
    id: "er",
    title: "ER Diagram",
    content: `erDiagram
    CONTACT_FORM ||--|| MONGODB_COLLECTION : creates_record
    CONTACT_FORM {
        string _id
        string name
        string email
        string subject
        string message
        date createdAt
    }`
  },
  {
    id: "component",
    title: "Component Diagram",
    content: `flowchart TD
    UI[Contact UI] --> Form[Form Component]
    Form --> NextAPI{Next.js Route }
    NextAPI --> Express[Express Server]
    Express --> Model((Mongoose Model))
    Model --> DB[(MongoDB )]`
  },
  {
    id: "deployment",
    title: "Deployment Diagram",
    content: `flowchart TD
    subgraph Frontend Edge
        Web([Client Browser]) --> Vercel[Vercel Serverless]
    end
    subgraph Backend Cloud
        Vercel --> Render[Render Node.js Server]
        Render --> DB[(Mongo Atlas )]
    end`
  },
  {
    id: "state",
    title: "State Machine",
    content: `stateDiagram-v2
    [*] --> Draft
    Draft --> Validating : Click Submit
    Validating --> Submitting : Validation Passed
    Validating --> Draft : Validation Failed
    Submitting --> Success : DB Save OK
    Submitting --> Error : Network Failure
    Success --> [*]`
  },
  {
    id: "activity",
    title: "Activity Diagram",
    content: `flowchart TD
    Start([User Fills Form]) --> Submit[/Click Submit/]
    Submit --> Validate{Inputs Valid? }
    Validate -- No --> ShowError[/Display Error/]
    Validate -- Yes --> CallAPI[Send POST Request]
    CallAPI --> Save[(Save to DB )]
    Save --> DBCheck{Success? }
    DBCheck -- Yes --> SuccessUI([Show Thank You])
    DBCheck -- No --> ShowError
    SuccessUI --> End(((End)))
    ShowError --> Draft([Back to Edit])`
  },
  {
    id: "usecase",
    title: "Use Case Diagram",
    content: `flowchart LR
    Visitor((Website Visitor)) --> Submit([Submit Inquiry])
    System((System User)) --> Store([Store Message])
    Admin((Site Admin)) --> Read([Read Inquiries])
    Submit -.-> Store`
  },
  {
    id: "dfd",
    title: "Data Flow Diagram",
    content: `flowchart TD
    User((Visitor)) -- "Form Data" --> Process1[1.0 Validation Process]
    Process1 -- "Sanitized Data" --> Process2[2.0 API Transmission]
    Process2 -- "JSON Payload" --> Process3[3.0 DB Insertion]
    Process3 -- "Document ID" --> DB[(Mongo DB )]
    Process3 -- "Status 200" --> User`
  },
  {
    id: "network",
    title: "Network Topology",
    content: `flowchart TD
    Device((Client Device)) --- CDN{Cloudflare/Vercel CDN }
    CDN --- Frontend[Next.js App]
    Frontend --- API{Render API Gateway }
    API --- Cluster[(Database Cluster )]`
  },
  {
    id: "swimlane",
    title: "Sequence + Swimlane",
    content: `sequenceDiagram
    participant U as User (UI)
    participant F as Frontend (Next.js)
    participant B as Backend (Express)
    participant D as Database (Mongo)
    U->>F: Fills form & Submits
    F->>F: Validate Inputs
    F->>B: POST /api/contact
    B->>D: Model.save()
    D-->>B: Confirmation
    B-->>F: HTTP 201 Created
    F-->>U: Show Success Banner`
  },
  {
    id: "c4",
    title: "C4 Context Diagram",
    content: `flowchart TD
    User((Website Visitor))
    System[Contact Management System]
    ExtSMTP[SMTP Email Gateway]
    
    User -- "Submits general inquiry" --> System
    System -- "Forwards notification email" --> ExtSMTP`
  },
  {
    id: "eventstorming",
    title: "Event Storming",
    content: `flowchart LR
    subgraph Command
        C1[Submit Form]
    end
    subgraph Aggregate
        A1[(Contact Form Thread)]
    end
    subgraph Event
        E1[/Form Validated/]
        E2[/Message Saved to DB/]
        E3[/Admin Notified/]
    end
    C1 --> A1
    A1 --> E1
    E1 --> E2
    E2 --> E3`
  },
  {
    id: "servicedep",
    title: "Service Dependencies",
    content: `flowchart TD
    UI[Next.js Client]
    API[Backend API]
    DB[(MongoDB)]
    
    UI -->|Downstream Call| API
    API -.->|Data Layer Dependency| DB`
  },
  {
    id: "sequenceapi",
    title: "API Contracts",
    content: `sequenceDiagram
    participant UI as Client
    participant API as Server
    
    Note over UI,API: Req: POST /contact {name, email, message}
    UI->>API: HTTP POST JSON
    Note over API: Res: 201 Created
    API-->>UI: {success: true, message: "Received"}`
  },
  {
    id: "bpmn",
    title: "BPMN Workflow",
    content: `flowchart TD
    Start((Start)) --> Task1[Task: Client Side Validation]
    Task1 --> Gateway{Valid?}
    Gateway -- No --> EndEvent1(((Error End)))
    Gateway -- Yes --> Task2[Task: Server Side Insert]
    Task2 --> EndEvent2(((Success End)))`
  },
  {
    id: "adr",
    title: "ADR Decision Tree",
    content: `flowchart TD
    Context[/Context: How to store contact messages?/]
    Decision{Decision: NoSQL vs SQL vs Email Only?}
    Opt1[Option: Just send an email]
    Opt2[Option: Save to MongoDB]
    Context --> Decision
    Decision -.-> Opt1
    Decision -.-> Opt2
    Opt2 --> Chosen[/Status: Accepted MongoDB to preserve history & allow admin dashboard viewing/]`
  },
  {
    id: "threat",
    title: "Threat Model",
    content: `flowchart TD
    Actor((Bot/Spammer)) -->|XSS Payload| Input[/Form Message Field/]
    Input --> Boundary{Next.js Trust Boundary}
    Boundary --> API[Node.js Validation]
    API -->|Mitigation: DOMPurify / Mongoose validation| DB[(Mongo DB)]`
  },
  {
    id: "syscontext",
    title: "System Context",
    content: `flowchart TD
    User((Potential Client))
    BlackBox[Inquiry System Black Box]
    Admin((Company Admin))
    
    User -- Sends Data --> BlackBox
    BlackBox -- Exposes Logs --> Admin`
  }
];
