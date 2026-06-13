"use client";
import React, { useState, useEffect } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

export interface Diagram {
  id: string;
  title: string;
  content: string;
}

export default function DiagramTabs({ diagrams }: { diagrams: Diagram[] }) {
  const [activeTab, setActiveTab] = useState(diagrams[0]?.id || "");
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const activeDiagram = diagrams.find((d) => d.id === activeTab);

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
    if (ready && activeDiagram) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      
      const timer = setTimeout(() => {
         const nodes = document.querySelectorAll('.mermaid-dynamic');
         if (nodes.length > 0) {
            mermaid.run({ nodes: Array.from(nodes) as HTMLElement[] });
         }
      }, 50); // slight delay for React to mount the new div
      return () => clearTimeout(timer);
    }
  }, [ready, activeTab, activeDiagram]);

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

  if (!diagrams.length) return null;

  return (
    <div className="flex flex-col border border-indigo-500/20 rounded-xl bg-slate-900 overflow-hidden shadow-2xl mt-8">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-indigo-500/20 bg-slate-950 no-scrollbar">
        {diagrams.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveTab(d.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === d.id
                ? "border-b-2 border-indigo-500 text-indigo-400 bg-slate-900"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative p-6 min-h-[500px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-slate-950 border border-indigo-700/20 p-1.5 rounded-lg shadow-lg">
          <button onClick={() => setZoom((prev) => Math.min(prev + 0.2, 3))} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="Zoom In"><ZoomIn size={20} /></button>
          <button onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="Reset Zoom"><RefreshCw size={20} /></button>
          <button onClick={() => setZoom((prev) => Math.max(prev - 0.2, 0.4))} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="Zoom Out"><ZoomOut size={20} /></button>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`w-full flex justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`, transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.2s ease-in-out' }}
        >
          {ready && activeDiagram && (
            <div key={activeTab} className="mermaid-dynamic w-full flex justify-center pointer-events-none select-none">
              {activeDiagram.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
