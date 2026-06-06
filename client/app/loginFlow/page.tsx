"use client";
import { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";

export default function AdminPage() {
    const ref = useRef<HTMLDivElement>(null);
    const [ready,setReady]= useState(false);
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        background: "#285bd0",
        primaryColor: "#15232c",
        primaryTextColor: "#2b3d4f",
        lineColor: "#cb14d8",
        actorBorder: "#0a7148",
        actorBkg: "#1d3e59",
        signalColor: "#6fc898",
        signalTextColor: "#122133",
        labelBoxBkgColor: "#2d457b",
        labelBoxBorderColor: "#38bdf8",
        labelTextColor: "#161b21",
        loopBkgColor: "#122e3e",
        noteBkgColor: "#84bbdc",
        noteBorderColor: "#38bdf8",
      },
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && ref.current) {
      mermaid.run({ nodes: [ref.current] });
    }
  }, [ready]);
 

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Flow Diagram */}
      <section className="p-6 border-b">
        <h2 className="text-2xl text-center font-bold mb-4">Interactive Auth Lifecycle Flow</h2>
        <div className="bg-white border border-slate-800 rounded-xl p-4 overflow-x-auto custom-scrollbar flex justify-center min-h-[420px]">
          {ready &&(
          <div ref={ref} className="mermaid w-full">
{`sequenceDiagram
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
    Express->>AuthSvc: Issue JWT (server/src/services/authService.ts)
    AuthSvc-->>Express: Tokens
    Express->>SessionSvc: Save Session (server/src/services/session.ts)
    SessionSvc->>DB: Save Session (server/src/models/session.ts)
    Express-->>NextAPI: Return JSON + Cookie
    NextAPI-->>User: accessToken stored (client/app/login/page.tsx)

    %% Login
    User->>NextAPI: POST /api/auth/login (client/app/api/auth/login/route.ts)
    NextAPI->>Express: Forward to Express (server/src/routes/authRoutes.ts)
    Express->>AuthSvc: Verify credentials (server/src/services/authService.ts)
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
    Express-->>User: 200 OK (Role updated)`}
          </div>
          )}
        </div>
      </section>

      {/* Code Repository */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">Code Repository</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Client Pages & Layouts</h3>
          <ul className="space-y-1 pl-4">
            <li>page.tsx — client/app/login/page.tsx</li>
            <li>navbar.tsx — client/components/navbar.tsx</li>
            <li>admin/page.tsx — client/app/admin/page.tsx</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Client API Proxy Routes</h3>
          <ul className="space-y-1 pl-4">
            <li>login/route.ts — client/app/api/auth/login/route.ts</li>
            <li>signup/route.ts — client/app/api/auth/signup/route.ts</li>
            <li>admin/users/route.ts — client/app/api/admin/users/route.ts</li>
            <li>users/[id]/route.ts — client/app/api/admin/users/[id]/route.ts</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Express Backend Entrypoint & Config</h3>
          <ul className="space-y-1 pl-4">
            <li>index.ts — server/src/index.ts</li>
            <li>db.ts — server/src/config/db.ts</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Models & Security Services</h3>
          <ul className="space-y-1 pl-4">
            <li>user.ts — server/src/models/user.ts</li>
            <li>session.ts — server/src/models/session.ts</li>
            <li>authService.ts — server/src/services/authService.ts</li>
            <li>session.ts (Service) — server/src/services/session.ts</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Express Routes & Middleware</h3>
          <ul className="space-y-1 pl-4">
            <li>authRoutes.ts — server/src/routes/authRoutes.ts</li>
            <li>adminRoutes.ts — server/src/routes/adminRoutes.ts</li>
            <li>adminMiddleware.ts — server/src/middleware/adminMiddleware.ts</li>
            <li>authMiddleware.ts (Next.js Ref) — server/src/middleware/authMiddleware.ts</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
