"use client";
import { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import { Folder, FolderOpen, FileCode, ChevronDown, ChevronRight, Link2, Info, ArrowRightLeft, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import Link from "next/link";

interface FileDetail {
  id: string;
  name: string;
  path: string;
  description: string;
  calls: string[];
  calledBy: string[];
  role: "page" | "component" | "api" | "route" | "middleware" | "controller" | "service" | "model" | "config";
}

const fileDetails: Record<string, FileDetail> = {
  "navbar.tsx": {
    id: "navbar.tsx",
    name: "navbar.tsx",
    path: "client/components/navbar.tsx",
    description: "Renders the main header/navigation bar across the application. Checks client authentication state by reading from localStorage, displays the user's name, and clears tokens/flags (accessToken, userName, adminUnlocked) on logout.",
    calls: ["/login (redirect)"],
    calledBy: ["client/app/layout.tsx (globally on all pages)"],
    role: "component"
  },
  "login/page.tsx": {
    id: "login/page.tsx",
    name: "page.tsx",
    path: "client/app/login/page.tsx",
    description: "Handles user login and signup interfaces. Controls form state, coordinates validation, calls authentication API endpoints, and saves JWT access token to localStorage.",
    calls: ["client/app/api/auth/login/route.ts", "client/app/api/auth/signup/route.ts"],
    calledBy: ["Browser navigation / user visiting /login"],
    role: "page"
  },
  "admin/page.tsx": {
    id: "admin/page.tsx",
    name: "page.tsx",
    path: "client/app/admin/page.tsx",
    description: "Secure user roles administration panel. Guarded by a secondary password verification input. Renders the User Role Management dashboard list, allowing role updates (PATCH) and user deletion (DELETE). Integrates auto-refresh token logic on 401 Unauthorized errors.",
    calls: ["client/app/api/admin/users/route.ts", "client/app/api/admin/users/[id]/route.ts", "client/app/api/auth/refresh/route.ts"],
    calledBy: ["Browser navigation / admin users visiting /admin"],
    role: "page"
  },
  "api/auth/login": {
    id: "api/auth/login",
    name: "route.ts",
    path: "client/app/api/auth/login/route.ts",
    description: "Next.js API proxy route. Forwards client POST credentials to the backend Server at /api/auth/login. Transfers and configures the received HttpOnly refresh token cookie on the browser client.",
    calls: ["server/src/routes/authRoutes.ts (POST /api/auth/login)"],
    calledBy: ["client/app/login/page.tsx"],
    role: "api"
  },
  "api/auth/signup": {
    id: "api/auth/signup",
    name: "route.ts",
    path: "client/app/api/auth/signup/route.ts",
    description: "Next.js API proxy route. Forwards client POST signup information to the backend Server at /api/auth/signup. Sets up browser HttpOnly refresh token cookie via Set-Cookie header forwarding.",
    calls: ["server/src/routes/authRoutes.ts (POST /api/auth/signup)"],
    calledBy: ["client/app/login/page.tsx"],
    role: "api"
  },
  "api/auth/refresh": {
    id: "api/auth/refresh",
    name: "route.ts",
    path: "client/app/api/auth/refresh/route.ts",
    description: "Next.js API proxy route for refreshing user sessions. Extracts and forwards the client's HttpOnly cookies containing the refresh token to the backend, returning the newly issued access token and saving the rotated cookie.",
    calls: ["server/src/routes/authRoutes.ts (POST /api/auth/refresh)"],
    calledBy: ["client/app/admin/page.tsx"],
    role: "api"
  },
  "api/admin/users": {
    id: "api/admin/users",
    name: "route.ts",
    path: "client/app/api/admin/users/route.ts",
    description: "Next.js API proxy route for getting user list. Passes the client's Authorization header (Bearer token) to the backend's GET /api/admin/users endpoint.",
    calls: ["server/src/routes/adminRoutes.ts (GET /api/admin/users)"],
    calledBy: ["client/app/admin/page.tsx"],
    role: "api"
  },
  "api/admin/users/[id]": {
    id: "api/admin/users/[id]",
    name: "route.ts",
    path: "client/app/api/admin/users/[id]/route.ts",
    description: "Next.js API proxy route for editing/deleting specific user IDs. Forwards PATCH (role update) and DELETE (user delete) requests along with Bearer access token authentication header to the backend.",
    calls: ["server/src/routes/adminRoutes.ts (PATCH/DELETE /api/admin/users/:id)"],
    calledBy: ["client/app/admin/page.tsx"],
    role: "api"
  },
  "index.ts": {
    id: "index.ts",
    name: "index.ts",
    path: "server/src/index.ts",
    description: "Express backend server entrypoint. Initiates CORS, JSON middleware, and a custom cookie parsing middleware to populate req.cookies. Binds /api/auth, /api/admin, and /api/ownership routes, and starts the server on port 5000.",
    calls: ["server/src/routes/authRoutes.ts", "server/src/routes/adminRoutes.ts", "server/src/routes/ownershipRoutes.ts", "server/src/config/db.ts"],
    calledBy: ["Process execution (npm run dev)"],
    role: "config"
  },
  "db.ts": {
    id: "db.ts",
    name: "db.ts",
    path: "server/src/config/db.ts",
    description: "Establishes connection to the Mongo database cluster using mongoose client configuration.",
    calls: ["MongoDB Database Atlas Cluster"],
    calledBy: ["server/src/index.ts"],
    role: "config"
  },
  "authRoutes.ts": {
    id: "authRoutes.ts",
    name: "authRoutes.ts",
    path: "server/src/routes/authRoutes.ts",
    description: "Defines backend Express auth routing mapping POST /login, POST /signup, POST /refresh, and POST /logout endpoints directly to authController actions.",
    calls: ["server/src/controllers/authController.ts"],
    calledBy: ["server/src/index.ts"],
    role: "route"
  },
  "adminRoutes.ts": {
    id: "adminRoutes.ts",
    name: "adminRoutes.ts",
    path: "server/src/routes/adminRoutes.ts",
    description: "Defines backend Express admin routing. Maps GET /users, PATCH /users/:id, and DELETE /users/:id. Implements role-level checks through adminMiddleware and superUserMiddleware.",
    calls: ["server/src/middleware/adminMiddleware.ts", "server/src/controllers/adminController.ts"],
    calledBy: ["server/src/index.ts"],
    role: "route"
  },
  "ownershipRoutes.ts": {
    id: "ownershipRoutes.ts",
    name: "ownershipRoutes.ts",
    path: "server/src/routes/ownershipRoutes.ts",
    description: "Defines backend Express owner routing for performing super-admin database operations like ownership transfers.",
    calls: ["server/src/controllers/ownershipController.ts"],
    calledBy: ["server/src/index.ts"],
    role: "route"
  },
  "adminMiddleware.ts": {
    id: "adminMiddleware.ts",
    name: "adminMiddleware.ts",
    path: "server/src/middleware/adminMiddleware.ts",
    description: "Express router authentication middleware. Decodes the incoming access token, validates the JWT, and restricts resource entry based on roles (owner, superuser, admin).",
    calls: ["jsonwebtoken validation"],
    calledBy: ["server/src/routes/adminRoutes.ts"],
    role: "middleware"
  },
  "authController.ts": {
    id: "authController.ts",
    name: "authController.ts",
    path: "server/src/controllers/authController.ts",
    description: "Handles logins, signups, cookie-based token refreshes, and logouts. Calls backend Services to verify credentials, save sessions, and issue fresh JWTs.",
    calls: ["server/src/services/services.ts"],
    calledBy: ["server/src/routes/authRoutes.ts"],
    role: "controller"
  },
  "adminController.ts": {
    id: "adminController.ts",
    name: "adminController.ts",
    path: "server/src/controllers/adminController.ts",
    description: "Executes admin operations: getUsersController queries paginated users list; updateUserRoleController handles role hierarchy checks; deleteUserController validates admin restrictions before deletion.",
    calls: ["server/src/models/user.ts"],
    calledBy: ["server/src/routes/adminRoutes.ts"],
    role: "controller"
  },
  "ownershipController.ts": {
    id: "ownershipController.ts",
    name: "ownershipController.ts",
    path: "server/src/controllers/ownershipController.ts",
    description: "Executes owner transfer operations, saving modified roles directly to user models.",
    calls: ["server/src/models/user.ts"],
    calledBy: ["server/src/routes/ownershipRoutes.ts"],
    role: "controller"
  },
  "services.ts": {
    id: "services.ts",
    name: "services.ts",
    path: "server/src/services/services.ts",
    description: "Core security and utility services. Provides password hashing, user credentials verification, JWT creation (access token & refresh token), and db session storage validation.",
    calls: ["server/src/models/user.ts", "server/src/models/session.ts"],
    calledBy: ["server/src/controllers/authController.ts"],
    role: "service"
  },
  "user.ts": {
    id: "user.ts",
    name: "user.ts",
    path: "server/src/models/user.ts",
    description: "Mongoose database User schema definition, defining fields for user name, email, passwordHash, and role.",
    calls: ["MongoDB Database User Collection"],
    calledBy: ["server/src/services/services.ts", "server/src/controllers/adminController.ts", "server/src/controllers/ownershipController.ts"],
    role: "model"
  },
  "session.ts": {
    id: "session.ts",
    name: "session.ts",
    path: "server/src/models/session.ts",
    description: "Mongoose database Session schema, storing hashed tokenId references to support refresh token revocation/sliding sessions.",
    calls: ["MongoDB Database Session Collection"],
    calledBy: ["server/src/services/services.ts"],
    role: "model"
  }
};

function ZoomableMermaid({ content, defaultZoom = 1 }: { content: string, defaultZoom?: number }) {
  const [zoom, setZoom] = useState(defaultZoom);
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

  return (
    <div className="relative overflow-hidden w-full flex justify-center bg-slate-900 border border-indigo-500/10 rounded-xl min-h-[500px]">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-slate-900 border border-indigo-700/20 p-1.5 rounded-lg shadow-lg">
        <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="Zoom In"><ZoomIn size={20} /></button>
        <button onClick={() => { setZoom(defaultZoom); setPosition({ x: 0, y: 0 }); }} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="Reset Zoom"><RefreshCw size={20} /></button>
        <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.4))} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="Zoom Out"><ZoomOut size={20} /></button>
      </div>
      <div
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}
        className={`w-full flex justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.2s ease-in-out', minWidth: '1000px' }}
      >
        <div className="mermaid w-full flex justify-center pointer-events-none select-none py-8">
          {content}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const ref = useRef<HTMLDivElement>(null);
  const repoRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>("admin/page.tsx");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    client: true,
    client_components: true,
    client_app: true,
    client_app_login: true,
    client_app_admin: true,
    client_app_api: true,
    client_app_api_auth: true,
    client_app_api_admin: true,
    server: true,
    server_src: true,
    server_src_config: true,
    server_src_routes: true,
    server_src_middleware: true,
    server_src_controllers: true,
    server_src_services: true,
    server_src_models: true,
  });

  const toggleFolder = (key: string) => {
    setExpandedFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        background: "#1e293b",
        primaryColor: "#1e293b",
        primaryTextColor: "#f8fafc",
        lineColor: "#38bdf8",
        actorBorder: "#3b82f6",
        actorBkg: "#1e3a8a",
        signalColor: "#10b981",
        signalTextColor: "#f8fafc",
        labelBoxBkgColor: "#1e293b",
        labelBoxBorderColor: "#475569",
        labelTextColor: "#f8fafc",
        loopBkgColor: "#0f172a",
        noteBkgColor: "#334155",
        noteBorderColor: "#475569",
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

  const selectedFileData = selectedFile ? fileDetails[selectedFile] : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-slate-100 font-sans">
      {/* Title Header */}
      <header className="p-6 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Authentication & Security Architecture
          </h1>
          <p className="text-gray-400 text-sm mt-1">Interactive system flows and file relationship directory map</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-blue-900 hover:bg-blue-800 border border-blue-700 text-sm font-medium rounded-lg transition-colors">
          Go Back Home
        </Link>
      </header>

      {/* Flow Diagram */}
      <section className="p-6 border-b border-gray-800 bg-gray-900/50">
        <h2 className="text-2xl font-bold mb-4 text-slate-200">Interactive Auth Lifecycle Flow</h2>
        <div className="flex justify-center w-full">
          {ready && (
            <ZoomableMermaid defaultZoom={1} content={`sequenceDiagram
    autonumber
    actor User as User Agent
    participant NextAPI as Next.js API Proxy
    participant Express as Express Routes
    participant AuthSvc as AuthService
    participant SessionSvc as Session Service
    participant DB as MongoDB
    participant AdminMW as Admin Middleware

    %% Signup
    User->>NextAPI: POST /api/auth/signup (client/app/api/auth/signup/route.ts)
    NextAPI->>Express: Forward to Express (server/src/routes/authRoutes.ts)
    Express->>DB: Save User (server/src/models/user.ts)
    Express->>AuthSvc: Issue JWT (server/src/services/services.ts)
    AuthSvc-->>Express: Tokens
    Express->>SessionSvc: Save Session (server/src/services/services.ts)
    SessionSvc->>DB: Save Session (server/src/models/session.ts)
    Express-->>NextAPI: Return JSON + Cookie
    NextAPI-->>User: accessToken stored (client/app/login/page.tsx)

    %% Login
    User->>NextAPI: POST /api/auth/login (client/app/api/auth/login/route.ts)
    NextAPI->>Express: Forward to Express (server/src/routes/authRoutes.ts)
    Express->>AuthSvc: Verify credentials (server/src/services/services.ts)
    AuthSvc->>DB: Find user (server/src/models/user.ts)
    AuthSvc-->>Express: Valid user
    Express->>AuthSvc: Issue JWT
    AuthSvc->>SessionSvc: Save session
    SessionSvc->>DB: Save session
    Express-->>NextAPI: Return { accessToken, role, name }
    NextAPI-->>User: Store token + cookie (client/components/navbar.tsx)

    %% Secure Request
    User->>NextAPI: GET /api/admin/users (client/app/api/admin/users/route.ts)
    NextAPI->>Express: Forward with Bearer Token (server/src/routes/adminRoutes.ts)
    Express->>AdminMW: Verify role === "admin" (server/src/middleware/adminMiddleware.ts)
    AdminMW-->>Express: Authorized
    Express->>DB: Fetch users
    Express-->>User: Return user list

    %% Promotion
    User->>NextAPI: PATCH /api/admin/users/:id (client/app/api/admin/users/[id]/route.ts)
    NextAPI->>Express: Forward PATCH (server/src/routes/adminRoutes.ts)
    Express->>AdminMW: Verify admin role
    AdminMW-->>Express: Authorized
    Express->>DB: findByIdAndUpdate (server/src/models/user.ts)
    Express-->>User: 200 OK (Role updated)`} />
          )}
        </div>
      </section>

      {/* Code Repository with Interactive Folder Tree and Connections */}
      <section className="p-6 bg-gray-950">

        {/* Connections Diagram */}
        <div className="flex w-full justify-center">
          {ready && (
            <ZoomableMermaid defaultZoom={1} content={`flowchart TD
    %% Styling defined with classes
    classDef clientPage fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef clientApi fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff;
    classDef serverRoute fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef serverController fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#1f2937;
    classDef serverMiddleware fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#fff;
    classDef serverService fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff;
    classDef serverModel fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff;
    classDef serverConfig fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff;

    subgraph Client ["Client Interface (Next.js)"]
        direction TB
        c_login["client/app/login/page.tsx<br>(Login/Signup UI)"]:::clientPage
        c_admin["client/app/admin/page.tsx<br>(Admin Panel & Refresh)"]:::clientPage
        c_nav["client/components/navbar.tsx<br>(Navbar Logout)"]:::clientPage
    end

    subgraph APIProxy ["Next.js API Proxies"]
        direction TB
        c_api_login["client/app/api/auth/login/route.ts"]:::clientApi
        c_api_signup["client/app/api/auth/signup/route.ts"]:::clientApi
        c_api_refresh["client/app/api/auth/refresh/route.ts"]:::clientApi
        c_api_users["client/app/api/admin/users/route.ts"]:::clientApi
        c_api_users_id["client/app/api/admin/users/[id]/route.ts"]:::clientApi
    end

    subgraph ServerInit ["Server Config"]
        direction TB
        s_index["server/src/index.ts<br>(Express Server)"]:::serverConfig
        s_db["server/src/config/db.ts<br>(Mongoose Connect)"]:::serverConfig
    end

    subgraph Routes ["Express Routes"]
        direction TB
        s_route_auth["server/src/routes/authRoutes.ts"]:::serverRoute
        s_route_admin["server/src/routes/adminRoutes.ts"]:::serverRoute
        s_route_owner["server/src/routes/ownershipRoutes.ts"]:::serverRoute
    end

    subgraph Controllers ["Controllers & Middleware"]
        direction TB
        s_mw_admin["server/src/middleware/adminMiddleware.ts"]:::serverMiddleware
        s_ctrl_auth["server/src/controllers/authController.ts"]:::serverController
        s_ctrl_admin["server/src/controllers/adminController.ts"]:::serverController
        s_ctrl_owner["server/src/controllers/ownershipController.ts"]:::serverController
    end

    subgraph DBTier ["Services & DB Models"]
        direction TB
        s_svc_sec["server/src/services/services.ts<br>(Token & Session Logic)"]:::serverService
        s_model_user["server/src/models/user.ts"]:::serverModel
        s_model_session["server/src/models/session.ts"]:::serverModel
    end

    Client --> APIProxy
    APIProxy --> Routes
    ServerInit -.-> Routes
    Routes --> Controllers
    Controllers --> DBTier`} />
          )}
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-2 text-slate-200">Repository Tree & Connections Explorer</h2>
        <p className="text-gray-400 text-sm mb-6">Click any file in the structure directory tree below to inspect its purpose, relative code path, and dependency connections.</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* Column 1: Interactive Tree View */}
          <div className="lg:col-span-5 bg-gray-900/80 rounded-xl p-4 border border-gray-800 min-h-[480px] overflow-y-auto max-h-[600px] select-none">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">File Directory</h3>

            <div className="space-y-1 text-sm">
              {/* CLIENT ROOT */}
              <div>
                <div onClick={() => toggleFolder("client")} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-800/60 rounded cursor-pointer transition-colors text-blue-400 font-semibold">
                  {expandedFolders.client ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {expandedFolders.client ? <FolderOpen size={16} /> : <Folder size={16} />}
                  <span>client/</span>
                </div>

                {expandedFolders.client && (
                  <div className="pl-6 border-l border-gray-800 ml-4 mt-0.5 space-y-1">
                    {/* client/components */}
                    <div>
                      <div onClick={() => toggleFolder("client_components")} className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-800/60 rounded cursor-pointer transition-colors text-amber-500">
                        {expandedFolders.client_components ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {expandedFolders.client_components ? <FolderOpen size={14} /> : <Folder size={14} />}
                        <span>components/</span>
                      </div>
                      {expandedFolders.client_components && (
                        <div className="pl-6 border-l border-gray-800 ml-3 space-y-0.5 mt-0.5">
                          <div onClick={() => setSelectedFile("navbar.tsx")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "navbar.tsx" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                            <FileCode size={14} className="text-sky-400" />
                            <span>navbar.tsx</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* client/app */}
                    <div>
                      <div onClick={() => toggleFolder("client_app")} className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-800/60 rounded cursor-pointer transition-colors text-amber-500">
                        {expandedFolders.client_app ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {expandedFolders.client_app ? <FolderOpen size={14} /> : <Folder size={14} />}
                        <span>app/</span>
                      </div>
                      {expandedFolders.client_app && (
                        <div className="pl-6 border-l border-gray-800 ml-3 space-y-1.5 mt-0.5">
                          {/* client/app/login */}
                          <div>
                            <div onClick={() => toggleFolder("client_app_login")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.client_app_login ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>login/</span>
                            </div>
                            {expandedFolders.client_app_login && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("login/page.tsx")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "login/page.tsx" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-sky-400" />
                                  <span>page.tsx</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* client/app/admin */}
                          <div>
                            <div onClick={() => toggleFolder("client_app_admin")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.client_app_admin ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>admin/</span>
                            </div>
                            {expandedFolders.client_app_admin && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("admin/page.tsx")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "admin/page.tsx" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-sky-400" />
                                  <span>page.tsx</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* client/app/api */}
                          <div>
                            <div onClick={() => toggleFolder("client_app_api")} className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-800/60 rounded cursor-pointer transition-colors text-amber-500">
                              {expandedFolders.client_app_api ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>api/</span>
                            </div>
                            {expandedFolders.client_app_api && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-1 mt-0.5">
                                {/* api/auth */}
                                <div>
                                  <div onClick={() => toggleFolder("client_app_api_auth")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                                    {expandedFolders.client_app_api_auth ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    <span>auth/</span>
                                  </div>
                                  {expandedFolders.client_app_api_auth && (
                                    <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5">
                                      <div onClick={() => setSelectedFile("api/auth/login")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "api/auth/login" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                        <FileCode size={14} className="text-cyan-400" />
                                        <span>login/route.ts</span>
                                      </div>
                                      <div onClick={() => setSelectedFile("api/auth/signup")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "api/auth/signup" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                        <FileCode size={14} className="text-cyan-400" />
                                        <span>signup/route.ts</span>
                                      </div>
                                      <div onClick={() => setSelectedFile("api/auth/refresh")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "api/auth/refresh" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                        <FileCode size={14} className="text-cyan-400" />
                                        <span>refresh/route.ts</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* api/admin */}
                                <div>
                                  <div onClick={() => toggleFolder("client_app_api_admin")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                                    {expandedFolders.client_app_api_admin ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    <span>admin/</span>
                                  </div>
                                  {expandedFolders.client_app_api_admin && (
                                    <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5">
                                      <div onClick={() => setSelectedFile("api/admin/users")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "api/admin/users" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                        <FileCode size={14} className="text-cyan-400" />
                                        <span>users/route.ts</span>
                                      </div>
                                      <div onClick={() => setSelectedFile("api/admin/users/[id]")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "api/admin/users/[id]" ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                        <FileCode size={14} className="text-cyan-400" />
                                        <span>users/[id]/route.ts</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SERVER ROOT */}
              <div className="mt-4">
                <div onClick={() => toggleFolder("server")} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-800/60 rounded cursor-pointer transition-colors text-emerald-400 font-semibold">
                  {expandedFolders.server ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  {expandedFolders.server ? <FolderOpen size={16} /> : <Folder size={16} />}
                  <span>server/</span>
                </div>

                {expandedFolders.server && (
                  <div className="pl-6 border-l border-gray-800 ml-4 mt-0.5 space-y-1">
                    {/* server/src */}
                    <div>
                      <div onClick={() => toggleFolder("server_src")} className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-800/60 rounded cursor-pointer transition-colors text-amber-500">
                        {expandedFolders.server_src ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {expandedFolders.server_src ? <FolderOpen size={14} /> : <Folder size={14} />}
                        <span>src/</span>
                      </div>

                      {expandedFolders.server_src && (
                        <div className="pl-6 border-l border-gray-800 ml-3 space-y-1.5 mt-0.5">
                          {/* entry point */}
                          <div onClick={() => setSelectedFile("index.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "index.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                            <FileCode size={14} className="text-slate-400" />
                            <span>index.ts</span>
                          </div>

                          {/* server/src/config */}
                          <div>
                            <div onClick={() => toggleFolder("server_src_config")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.server_src_config ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>config/</span>
                            </div>
                            {expandedFolders.server_src_config && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("db.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "db.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-slate-400" />
                                  <span>db.ts</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* server/src/routes */}
                          <div>
                            <div onClick={() => toggleFolder("server_src_routes")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.server_src_routes ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>routes/</span>
                            </div>
                            {expandedFolders.server_src_routes && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("authRoutes.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "authRoutes.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-emerald-400" />
                                  <span>authRoutes.ts</span>
                                </div>
                                <div onClick={() => setSelectedFile("adminRoutes.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "adminRoutes.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-emerald-400" />
                                  <span>adminRoutes.ts</span>
                                </div>
                                <div onClick={() => setSelectedFile("ownershipRoutes.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "ownershipRoutes.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-emerald-400" />
                                  <span>ownershipRoutes.ts</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* server/src/middleware */}
                          <div>
                            <div onClick={() => toggleFolder("server_src_middleware")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.server_src_middleware ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>middleware/</span>
                            </div>
                            {expandedFolders.server_src_middleware && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("adminMiddleware.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "adminMiddleware.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-pink-400" />
                                  <span>adminMiddleware.ts</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* server/src/controllers */}
                          <div>
                            <div onClick={() => toggleFolder("server_src_controllers")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.server_src_controllers ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>controllers/</span>
                            </div>
                            {expandedFolders.server_src_controllers && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("authController.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "authController.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-yellow-400" />
                                  <span>authController.ts</span>
                                </div>
                                <div onClick={() => setSelectedFile("adminController.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "adminController.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-yellow-400" />
                                  <span>adminController.ts</span>
                                </div>
                                <div onClick={() => setSelectedFile("ownershipController.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "ownershipController.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-yellow-400" />
                                  <span>ownershipController.ts</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* server/src/services */}
                          <div>
                            <div onClick={() => toggleFolder("server_src_services")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.server_src_services ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>services/</span>
                            </div>
                            {expandedFolders.server_src_services && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("services.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "services.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-purple-400" />
                                  <span>services.ts</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* server/src/models */}
                          <div>
                            <div onClick={() => toggleFolder("server_src_models")} className="flex items-center gap-1.5 px-1 py-0.5 text-gray-400 hover:text-slate-200 cursor-pointer">
                              {expandedFolders.server_src_models ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span>models/</span>
                            </div>
                            {expandedFolders.server_src_models && (
                              <div className="pl-4 border-l border-gray-800 ml-2 space-y-0.5 mt-0.5">
                                <div onClick={() => setSelectedFile("user.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "user.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-red-400" />
                                  <span>user.ts</span>
                                </div>
                                <div onClick={() => setSelectedFile("session.ts")} className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${selectedFile === "session.ts" ? "bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-500" : "hover:bg-gray-800/40 text-slate-300"}`}>
                                  <FileCode size={14} className="text-red-400" />
                                  <span>session.ts</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Column 2: Selected File Info & Connection Inspector */}
          <div className="lg:col-span-7 bg-gray-900/80 rounded-xl p-6 border border-gray-800 min-h-[480px] flex flex-col justify-between">
            {selectedFileData ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wider ${selectedFileData.role === "page" ? "bg-blue-600 text-white" :
                      selectedFileData.role === "component" ? "bg-sky-600 text-white" :
                        selectedFileData.role === "api" ? "bg-cyan-600 text-white" :
                          selectedFileData.role === "route" ? "bg-emerald-600 text-white" :
                            selectedFileData.role === "middleware" ? "bg-pink-600 text-white" :
                              selectedFileData.role === "controller" ? "bg-yellow-600 text-slate-900" :
                                selectedFileData.role === "service" ? "bg-purple-600 text-white" :
                                  selectedFileData.role === "model" ? "bg-red-600 text-white" : "bg-gray-600 text-white"
                      }`}>
                      {selectedFileData.role}
                    </span>
                    <h3 className="text-xl font-bold text-slate-100">{selectedFileData.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono bg-gray-950 p-2 rounded border border-gray-800">
                    <Info size={14} className="text-gray-500 shrink-0" />
                    <span className="break-all">{selectedFileData.path}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Functional Role</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedFileData.description}</p>
                </div>

                {/* Connections section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Incoming connections */}
                  <div className="bg-gray-950/40 p-3 rounded-lg border border-gray-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      <Link2 size={12} className="text-indigo-400 rotate-45" />
                      <span>Triggered / Called By</span>
                    </div>
                    {selectedFileData.calledBy.length > 0 ? (
                      <ul className="space-y-1.5">
                        {selectedFileData.calledBy.map((caller, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-500 shrink-0">•</span>
                            <span className="break-words">{caller}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-gray-500 italic">No incoming connections</span>
                    )}
                  </div>

                  {/* Outgoing connections */}
                  <div className="bg-gray-950/40 p-3 rounded-lg border border-gray-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      <ArrowRightLeft size={12} className="text-emerald-400" />
                      <span>Triggers / Imports</span>
                    </div>
                    {selectedFileData.calls.length > 0 ? (
                      <ul className="space-y-1.5">
                        {selectedFileData.calls.map((callee, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-500 shrink-0">•</span>
                            <span className="break-words">{callee}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-gray-500 italic">No outgoing connections</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <Info size={48} className="mb-3 opacity-30" />
                <p>Select any file from the directory tree to inspect its relationships.</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-800/80 mt-4 text-xs text-gray-500 flex justify-between items-center">
              <span>Selected Node: <b className="font-mono text-gray-400">{selectedFile || "None"}</b></span>
              <span className="text-slate-400">Next.js + Express Auth Architecture</span>
            </div>
          </div>

        </div>


      </section>
    </div>
  );
}

