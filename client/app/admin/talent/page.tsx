"use client";
import { useEffect, useState, useMemo } from "react";
import { User, Phone, Mail, Link as LinkIcon, Star, ArrowLeft, Trash2, Search, Filter, ArrowDownWideNarrow } from "lucide-react";
import Link from "next/link";

export default function TalentHub() {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters and Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProfession, setSelectedProfession] = useState<string>("All");

  async function refreshAccessToken(): Promise<string | null> {
    try {
      const res = await fetch("/codeforge/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          return data.accessToken;
        }
      }
    } catch {}
    return null;
  }

  useEffect(() => {
    async function fetchTalent() {
      try {
        let token = localStorage.getItem("accessToken");
        let res = await fetch("/codeforge/api/admin/talent", {
          headers: { Authorization: `Bearer ${token || ""}` },
        });

        if (res.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            res = await fetch("/codeforge/api/admin/talent", {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }

        if (res.ok) {
          const data = await res.json();
          setTalents(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load talent:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTalent();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this talent?")) return;
    
    try {
      let token = localStorage.getItem("accessToken");
      let res = await fetch(`/codeforge/api/admin/talent/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
          res = await fetch(`/codeforge/api/admin/talent/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      if (res.ok) {
        setTalents(prev => prev.filter(t => t._id !== id));
      } else {
        alert("Failed to delete talent");
      }
    } catch (err) {
      alert("Error deleting talent");
    }
  }

  // Derive unique professions
  const uniqueProfessions = useMemo(() => {
    const profs = new Set(talents.map(t => t.profession));
    return ["All", ...Array.from(profs)];
  }, [talents]);

  // Apply Filters and Sorting
  const filteredAndSortedTalents = useMemo(() => {
    let result = [...talents];

    // Filter by profession
    if (selectedProfession !== "All") {
      result = result.filter(t => t.profession === selectedProfession);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        (t.name && t.name.toLowerCase().includes(q)) || 
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.profession && t.profession.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "date") {
        valA = new Date(a.addedAt).getTime();
        valB = new Date(b.addedAt).getTime();
      } else {
        valA = a.score;
        valB = b.score;
      }
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [talents, searchQuery, sortBy, sortOrder, selectedProfession]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-slate-800/40 hover:bg-slate-700/60 rounded-full transition-colors border border-indigo-500/10">
          <ArrowLeft size={20} className="text-slate-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Talent Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">Curated list of high-scoring candidates discovered via the ATS Pipeline.</p>
        </div>
      </div>

      {/* Filters and Controls */}
      {!loading && talents.length > 0 && (
        <div className="mb-8 p-4 bg-slate-800/40 border border-indigo-500/10 rounded-xl flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-slate-500" size={16} />
            <select 
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {uniqueProfessions.map(prof => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowDownWideNarrow className="text-slate-500" size={16} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="date">Date Added</option>
              <option value="score">ATS Score</option>
            </select>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : talents.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-indigo-500/10">
          <Star className="mx-auto h-12 w-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No talents added yet</h3>
          <p className="text-sm text-slate-500 mt-1">Run candidates through the ATS pipeline and add them from the graph.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTalents.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-500">
              No candidates match your filters.
            </div>
          ) : filteredAndSortedTalents.map((talent) => (
            <div key={talent._id} className="bg-slate-800/40 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              
              <button 
                onClick={() => handleDelete(talent._id)}
                className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from Talent Hub"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-200">{talent.name}</h3>
                  <p className="text-sm font-medium text-indigo-400">{talent.profession}</p>
                </div>
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
                  {talent.score}
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail size={16} className="text-slate-500" />
                  <span className="truncate">{talent.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone size={16} className="text-slate-500" />
                  <span>{talent.phone}</span>
                </div>
                
                {talent.links && talent.links.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-slate-700/50 flex flex-wrap gap-2">
                    {talent.links.map((link: string, i: number) => {
                      let hostname = link;
                      try { hostname = new URL(link).hostname } catch(e) {}
                      return (
                        <a 
                          key={i} 
                          href={link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-700 hover:border-indigo-500 hover:text-indigo-300 text-xs text-slate-400 transition-colors"
                        >
                          <LinkIcon size={12} />
                          {hostname}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-xs text-slate-600 font-medium uppercase tracking-wider">
                Added: {new Date(talent.addedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
