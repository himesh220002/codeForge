"use client";

import { useState, useEffect } from "react";
import { Terminal, CheckCircle2, Loader2, X } from "lucide-react";

export default function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "ready" | "error" | "hidden">("checking");
  const [show, setShow] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/`, { method: "GET" });
        if (res.ok) {
          setStatus("ready");
          clearInterval(interval);
          // Hide after 5 seconds of being ready
          setTimeout(() => {
            setShow(false);
          }, 5000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("checking"); // Keep checking if connection fails (e.g., waking up)
      }
    };

    checkBackend();
    interval = setInterval(checkBackend, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-opacity duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden text-sm max-w-sm w-full">
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="w-4 h-4" />
            <span className="font-mono text-xs font-semibold tracking-wider uppercase">System Status</span>
          </div>
          <button 
            onClick={() => setShow(false)} 
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4">
          {status === "checking" && (
            <div className="flex items-start gap-3">
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-200 font-medium mb-1">Backend is waking up...</p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  The server is currently activating. Since it is hosted on Render's free tier, it may take 1-2 minutes to spin up. Please wait.
                </p>
              </div>
            </div>
          )}

          {status === "ready" && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-200 font-medium mb-1">Backend is ready!</p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  The server is fully activated. You can now continue using the application.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              </div>
              <div>
                <p className="text-zinc-200 font-medium mb-1">Connection Error</p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Unable to reach the backend server. We will keep trying to reconnect.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
