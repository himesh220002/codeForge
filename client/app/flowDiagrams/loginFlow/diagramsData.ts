export const loginFlowDiagrams = [
  {
    id: "class",
    title: "Class Diagram",
    content: `classDiagram
  class User {
    +String name
    +String email
    +String passwordHash
    +String role
  }
  class Session {
    +String userId
    +String refreshTokenHash
    +Date expiresAt
  }
  class AuthService {
    +login(email, password)
    +signup(data)
    +refreshTokens(oldToken)
  }
  class JwtUtils {
    +generateAccessToken()
    +generateRefreshToken()
    +verifyToken()
  }
  AuthService --> User : Queries
  AuthService --> Session : Manages
  AuthService --> JwtUtils : Uses`
  },
  {
    id: "er",
    title: "ER Diagram",
    content: `erDiagram
    USER ||--o{ SESSION : has
    USER {
        ObjectId _id
        string name
        string email
        string password
        string role
    }
    SESSION {
        ObjectId _id
        ObjectId userId
        string tokenId
        date expiresAt
    }`
  },
  {
    id: "component",
    title: "Component Diagram",
    content: `flowchart TD
    Client[Next.js Client] --> NextAPI{API Routes }
    NextAPI --> AuthRouter[Express Auth Router]
    AuthRouter --> AuthController[Auth Controller]
    AuthController --> AuthService[Auth Service]
    AuthService --> UserDB[(Users Collection )]
    AuthService --> SessionDB[(Sessions Collection )]`
  },
  {
    id: "deployment",
    title: "Deployment Diagram",
    content: `flowchart TD
    subgraph Browser
        UI([Local Storage])
    end
    subgraph Edge
        NextJS[Next.js API Routes]
    end
    subgraph Node Server
        Express[Auth API]
    end
    subgraph Database
        MongoDB[(Atlas Cluster )]
    end
    UI -- "Access Token" --> NextJS
    UI -- "Refresh Cookie" --> NextJS
    NextJS -- "Proxied Request" --> Express
    Express -- "Mongoose" --> MongoDB`
  },
  {
    id: "state",
    title: "State Machine",
    content: `stateDiagram-v2
    [*] --> Anonymous
    Anonymous --> Authenticated : Login Success
    Authenticated --> TokenExpired : Access Token TTL Over
    TokenExpired --> Refreshing : Auto Refresh Call
    Refreshing --> Authenticated : Valid Refresh Token
    Refreshing --> LoggedOut : Invalid Refresh Token
    Authenticated --> LoggedOut : User Logout
    LoggedOut --> [*]`
  },
  {
    id: "activity",
    title: "Activity Diagram",
    content: `flowchart TD
    Start([Login Click]) --> SendCreds[/POST /login/]
    SendCreds --> VerifyUser{User Exists? }
    VerifyUser -- No --> Error[/Invalid Creds/]
    VerifyUser -- Yes --> VerifyPass{Password Match? }
    VerifyPass -- No --> Error
    VerifyPass -- Yes --> GenTokens[Generate JWTs]
    GenTokens --> SaveSession[(Save Session DB )]
    SaveSession --> SetCookie[/Set HttpOnly Cookie/]
    SetCookie --> ReturnAccess[/Return Access Token/]
    ReturnAccess --> End([Dashboard])
    Error --> EndError(((End)))`
  },
  {
    id: "usecase",
    title: "Use Case Diagram",
    content: `flowchart LR
    Guest((Guest User)) --> Signup([Sign Up])
    Guest --> Login([Log In])
    User((Auth User)) --> AccessSecure([Access Admin])
    User --> Logout([Log Out])
    Admin((Super Admin)) --> ManageRoles([Manage Roles])
    ManageRoles -.-> AccessSecure`
  },
  {
    id: "dfd",
    title: "Data Flow Diagram",
    content: `flowchart TD
    User((User)) -- "Email & Password" --> Process1[1.0 Auth Controller]
    Process1 -- "Credentials" --> Process2[2.0 Auth Service]
    DB1[(Users DB )] -- "Hash & Salt" --> Process2
    Process2 -- "Validated User" --> Process3[3.0 Session Manager]
    Process3 -- "Session Doc" --> DB2[(Sessions DB )]
    Process3 -- "Tokens" --> User`
  },
  {
    id: "network",
    title: "Network Topology",
    content: `flowchart TD
    Browser((Client Browser)) --- Proxy{Next.js API Gateway }
    Proxy --- Server[Express Auth Node]
    Server --- Redis{Redis Cache }
    Server --- DB[(MongoDB Replica Set )]`
  },
  {
    id: "swimlane",
    title: "Sequence + Swimlane",
    content: `sequenceDiagram
    participant C as Client (Browser)
    participant N as Next.js Proxy
    participant E as Express API
    participant D as MongoDB
    C->>N: Request Secure Route (AccessToken)
    N->>E: Forward with Bearer
    E->>E: Verify JWT signature
    alt is valid
        E->>D: Fetch resource
        D-->>E: Data
        E-->>C: 200 OK + Data
    else is expired
        E-->>C: 401 Unauthorized
        C->>N: /api/auth/refresh (Cookie)
        N->>E: POST /refresh
        E->>D: Check Session validity
        D-->>E: Valid
        E-->>C: 200 OK + New AccessToken
    end`
  },
  {
    id: "c4",
    title: "C4 Context Diagram",
    content: `flowchart TD
    User((Platform User))
    System[Authentication Core]
    ExtGoogle[Google OAuth Service]
    
    User -- "Registers and logs in" --> System
    System -.-> "Delegated Social Auth (Future)" -.-> ExtGoogle`
  },
  {
    id: "eventstorming",
    title: "Event Storming",
    content: `flowchart LR
    subgraph Command
        C1[Attempt Login]
    end
    subgraph Aggregate
        A1[(User Credentials)]
    end
    subgraph Event
        E1[/Login Successful/]
        E2[/Session Created/]
        E3[/Access Token Issued/]
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
    FrontendUI[Client Next.js]
    AuthProxy[Next.js API Proxy]
    AuthEngine[Express JWT Engine]
    Mongo[(Mongo DB Cluster)]
    
    FrontendUI -->|Next/Router| AuthProxy
    AuthProxy -->|HTTP POST| AuthEngine
    AuthEngine -.->|Mongoose TCP| Mongo`
  },
  {
    id: "sequenceapi",
    title: "API Contracts",
    content: `sequenceDiagram
    participant UI as Client
    participant API as Auth Server
    
    Note over UI,API: Req: POST /login {email, password}
    UI->>API: HTTP POST JSON
    Note over API: Res: 200 OK + Set-Cookie
    API-->>UI: {accessToken: "ey...", role: "admin"}`
  },
  {
    id: "bpmn",
    title: "BPMN Workflow",
    content: `flowchart TD
    Start((Start)) --> Task1[Task: Verify bcrypt Hash]
    Task1 --> Gateway{Match?}
    Gateway -- No --> EndEvent1(((401 Unauthorized End)))
    Gateway -- Yes --> Task2[Task: Issue short-lived JWT]
    Task2 --> Task3[Task: Issue long-lived Refresh Token in Cookie]
    Task3 --> EndEvent2(((200 OK End)))`
  },
  {
    id: "adr",
    title: "ADR Decision Tree",
    content: `flowchart TD
    Context[/Context: Need secure auth sessions without high DB load/]
    Decision{Decision: JWT vs Stateful Sessions?}
    Opt1[Option: Stateful Redis Sessions]
    Opt2[Option: Stateless JWTs]
    Context --> Decision
    Decision -.-> Opt1
    Decision -.-> Opt2
    Opt2 --> Chosen[/Status: Accepted JWT. Access token in memory, Refresh token in HttpOnly cookie/]`
  },
  {
    id: "threat",
    title: "Threat Model",
    content: `flowchart TD
    Actor((Attacker)) -->|XSS Attack| LocalStorage[/Local Storage Token/]
    LocalStorage --> Impact1[Access Token Stolen]
    Actor -->|CSRF Attack| Cookie[/HttpOnly Cookie/]
    Cookie --> Impact2[Refresh Token Protected by SameSite]
    Impact1 --> Boundary{Trust Boundary}
    Boundary --> API[Resource Server: Short TTL mitigates impact]`
  },
  {
    id: "syscontext",
    title: "System Context",
    content: `flowchart TD
    User((End User))
    BlackBox[Auth & Access Control Subsystem]
    Admin((Super Admin))
    
    User -- Logs In & Acts --> BlackBox
    BlackBox -- Exposes Role Data --> Admin
    Admin -- Promotes/Demotes Users --> BlackBox`
  }
];
