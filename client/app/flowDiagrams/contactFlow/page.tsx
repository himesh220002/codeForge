"use client";
import React, { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import Link from "next/link";

export default function ContactFlowPage() {
    const ref = useRef<HTMLDivElement>(null);
    const repoRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
                background: "#1e293b",
                primaryColor: "#1e293b",
                primaryTextColor: "#f8fafc",
                lineColor: "#38bdf8",
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
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                        Contact Form Architecture
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Interactive lifecycle flow and file relationship directory map
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 bg-pink-900 hover:bg-pink-800 border border-pink-700 text-sm font-medium rounded-lg transition-colors"
                >
                    Go Back Home
                </Link>
            </header>
            {/* Flow Diagram */}
            <section className="p-6 border-b border-gray-800 bg-gray-900/50">
                <h2 className="text-2xl font-bold mb-4 text-slate-200">
                    Interactive Contact Lifecycle Flow
                </h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto flex justify-center min-h-[420px]">
                    {ready && (
                        <div ref={ref} className="mermaid w-full">
                            {`sequenceDiagram
    autonumber
    actor User as User Agent
    participant NextAPI as Next.js API Proxy
    participant Express as Express Routes
    participant ContactCtrl as Contact Controller
    participant DB as MongoDB

    User->>NextAPI: POST /api/contact (client/app/api/contact/route.ts)
    NextAPI->>Express: Forward to Express (server/src/routes/contactRoutes.ts)
    Express->>ContactCtrl: createContactController (server/src/controllers/contactController.ts)
    ContactCtrl->>DB: Save Contact (server/src/models/contact.ts)
    DB-->>ContactCtrl: Document saved
    ContactCtrl-->>Express: Success JSON
    Express-->>NextAPI: Return response
    NextAPI-->>User: Show success message`}
                        </div>
                    )}
                </div>
            </section>
            {/* Connections Diagram */}
            <section className="p-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto flex flex-col items-center min-h-[500px]">
                    <h3 className="text-lg font-bold text-slate-200 mb-2">
                        Architecture Connection Map
                    </h3>
                    <p className="text-gray-400 text-xs mb-6 text-center max-w-xl">
                        Flowchart visualization of contact form proxy paths, backend routing controllers, and MongoDB dependencies.
                    </p>
                    {ready && (
                        <div ref={repoRef} className="mermaid w-full flex justify-center">
                            {`flowchart TD
    classDef clientPage fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef clientApi fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff;
    classDef serverRoute fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef serverController fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#1f2937;
    classDef serverModel fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff;
    classDef serverConfig fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff;

    c_contact["client/app/contact/page.tsx<br>(Contact Page UI)"]:::clientPage
    c_form["client/components/contactForm.tsx<br>(Form Component)"]:::clientPage
    c_api_contact["client/app/api/contact/route.ts"]:::clientApi

    s_index["server/src/index.ts<br>(Express Server)"]:::serverConfig
    s_db["server/src/config/db.ts<br>(Mongoose Connect)"]:::serverConfig

    s_route_contact["server/src/routes/contactRoutes.ts"]:::serverRoute
    s_ctrl_contact["server/src/controllers/contactController.ts"]:::serverController
    s_model_contact["server/src/models/contact.ts"]:::serverModel

    c_contact --> c_form
    c_form --> c_api_contact
    c_api_contact --> s_route_contact
    s_index --> s_route_contact
    s_index --> s_db
    s_route_contact --> s_ctrl_contact
    s_ctrl_contact --> s_model_contact`}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
