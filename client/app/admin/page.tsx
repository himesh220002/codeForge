"use client";
import { useEffect, useState, useRef } from "react";
import { Users, Mail, Shield, Activity, ArrowRight, DatabaseZap, BarChart, Star } from "lucide-react";
import Link from "next/link";
import Chart from "chart.js/auto";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [health, setHealth] = useState<{ database: string, nvidia_api: string, has_nvidia_key: boolean } | null>(null);
  const [atsData, setAtsData] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

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
    } catch { }
    return null;
  }

  useEffect(() => {
    async function loadStats() {
      try {
        let token = localStorage.getItem("accessToken");

        // Fetch user count
        let usersRes = await fetch("/codeforge/api/admin/users?page=1&limit=1", {
          headers: { Authorization: `Bearer ${token || ""}` },
        });
        if (usersRes.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            usersRes = await fetch("/codeforge/api/admin/users?page=1&limit=1", {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUserCount(usersData.pagination?.total ?? 0);
        }

        // Fetch contact count
        let contactsRes = await fetch("/codeforge/api/admin/contacts", {
          headers: { Authorization: `Bearer ${token || ""}` },
        });
        if (contactsRes.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            contactsRes = await fetch("/codeforge/api/admin/contacts", {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContactCount(contactsData.data?.length ?? 0);
        }

        // Fetch health
        let healthRes = await fetch("/codeforge/api/admin/system/health", {
          headers: { Authorization: `Bearer ${token || ""}` },
        });
        if (healthRes.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            healthRes = await fetch("/codeforge/api/admin/system/health", {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setHealth(healthData.data);
        }

        // Fetch ATS analytics
        let atsRes = await fetch("/codeforge/api/admin/analytics/ats", {
          headers: { Authorization: `Bearer ${token || ""}` },
        });
        if (atsRes.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            atsRes = await fetch("/codeforge/api/admin/analytics/ats", {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
        if (atsRes.ok) {
          const atsResponse = await atsRes.json();
          setAtsData(atsResponse.data);
        }

      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Initialize Chart
  useEffect(() => {
    if (atsData && atsData.recentLogs && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const logs = atsData.recentLogs;

      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: logs.map((_: any, i: number) => `Run ${i + 1}`),
          datasets: [{
            label: 'ATS Match Score',
            data: logs.map((l: any) => l.score),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (e, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              setSelectedCandidate(logs[index]);
            } else {
              setSelectedCandidate(null);
            }
          },
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8' }
            },
            x: {
              grid: { display: false },
              ticks: { display: false } // hide x-axis text to keep it clean
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [atsData]);

  async function handleSeedJobs() {
    if (!confirm("Are you sure you want to seed the vector database? This will clear existing mock jobs and re-embed them via NVIDIA NIM.")) return;

    setIsSeeding(true);
    try {
      let token = localStorage.getItem("accessToken");
      let res = await fetch("/codeforge/api/jobs/seed", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token || ""}` }
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
          res = await fetch("/codeforge/api/jobs/seed", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        alert(`Success! ${data.message}`);
      } else {
        const err = await res.json();
        alert(`Failed to seed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to the seed endpoint.");
    } finally {
      setIsSeeding(false);
    }
  }

  async function handleAddTalent() {
    if (!selectedCandidate) return;
    
    try {
      let token = localStorage.getItem("accessToken");
      const payload = {
        name: selectedCandidate.candidateName,
        email: selectedCandidate.candidateEmail,
        phone: selectedCandidate.candidatePhone,
        links: selectedCandidate.candidateLinks,
        profession: selectedCandidate.targetProfession,
        score: selectedCandidate.score
      };

      let res = await fetch("/codeforge/api/admin/talent", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
          res = await fetch("/codeforge/api/admin/talent", {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
        }
      }

      if (res.ok) {
        alert(`Successfully added ${selectedCandidate.candidateName} to Talent Hub!`);
        setSelectedCandidate(null);
      } else {
        const err = await res.json();
        alert(`Failed: ${err.message}`);
      }
    } catch (error) {
      alert("Error adding to talent hub");
    }
  }

  const stats = [
    {
      label: "Total Users",
      value: userCount,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/10",
      iconColor: "text-blue-400",
      href: "/admin/users",
    },
    {
      label: "Contact Messages",
      value: contactCount,
      icon: Mail,
      color: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/10",
      iconColor: "text-purple-400",
      href: "/admin/contacts",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">Overview of your platform&apos;s key metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative bg-gray-900/60 border border-indigo-500/10 rounded-2xl p-6 hover:border-indigo-700/20 transition-all hover:shadow-lg hover:shadow-black/20"
            >
              <div className={`absolute inset-0 rounded-2xl ${stat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{stat.label}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-slate-100">{stat.value ?? "—"}</p>
                )}
              </div>
            </Link>
          );
        })}

        {/* System Health Card */}
        <div className="bg-gray-900/60 border border-indigo-500/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Activity size={18} className="text-white" />
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <p className="text-lg font-bold text-emerald-400">Core Services Online</p>
          </div>

          <div className="mt-4 pt-4 border-t border-indigo-800/20">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">NVIDIA NIM API</span>
              {health?.nvidia_api === "Online" ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Active
                </span>
              ) : (
                <span className="text-red-400 font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 inline-block"></span>
                  {health?.nvidia_api || "Loading..."}
                </span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">ChromaDB Vector Store</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/40 border border-indigo-500/10 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 border border-indigo-500/10 rounded-xl hover:bg-slate-800/70 hover:border-indigo-700/20 transition-all group"
          >
            <Shield size={16} className="text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Manage User Roles</p>
              <p className="text-xs text-slate-500">Promote, demote, or remove users</p>
            </div>
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 border border-indigo-500/10 rounded-xl hover:bg-slate-800/70 hover:border-indigo-700/20 transition-all group"
          >
            <Mail size={16} className="text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">View Contact Messages</p>
              <p className="text-xs text-slate-500">Read incoming contact form submissions</p>
            </div>
          </Link>
          <Link
            href="/admin/talent"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 border border-indigo-500/10 rounded-xl hover:bg-slate-800/70 hover:border-slate-700 transition-all group text-left"
          >
            <Star size={16} className="text-yellow-400" />
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Talent Hub</p>
              <p className="text-xs text-slate-500">View curated candidates saved from ATS</p>
            </div>
          </Link>
          <button
            onClick={handleSeedJobs}
            disabled={isSeeding}
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 border border-indigo-500/10 rounded-xl hover:bg-slate-800/70 hover:border-indigo-700/20 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DatabaseZap size={16} className={isSeeding ? "text-amber-400 animate-pulse" : "text-amber-400"} />
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                {isSeeding ? "Seeding Vectors..." : "Seed Job Database"}
              </p>
              <p className="text-xs text-slate-500">Re-initialize ChromaDB with mock jobs</p>
            </div>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="mt-8 bg-gray-900/40 border border-indigo-500/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Telemetry</h3>
            <h2 className="text-xl font-bold text-slate-200 mt-1">Live ATS Pipeline Usage</h2>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase">Avg Score</p>
              <p className="text-xl font-bold text-purple-400">{atsData?.averageScore ?? "--"}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase">Total Runs</p>
              <p className="text-xl font-bold text-blue-400">{atsData?.totalRuns ?? "--"}</p>
            </div>
          </div>
        </div>

        <div className="w-full h-64 bg-slate-900/50 rounded-xl border border-indigo-800/20 p-4">
          {!atsData ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
            </div>
          ) : atsData.recentLogs && atsData.recentLogs.length > 0 ? (
            <canvas ref={chartRef}></canvas>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col text-slate-500">
              <BarChart size={32} className="mb-2 opacity-50" />
              <p>No ATS telemetry data available yet.</p>
              <p className="text-xs mt-1">Run candidates through the Live ATS to generate data.</p>
            </div>
          )}
        </div>

        {/* Selected Candidate Card */}
        {selectedCandidate && (
          <div className="mt-6 p-4 bg-slate-800/40 border border-indigo-500/30 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Selected Candidate from Graph</p>
              <h4 className="text-lg font-bold text-slate-200">{selectedCandidate.candidateName || "Unknown Candidate"}</h4>
              <p className="text-sm text-slate-400 mt-0.5">
                <span className="text-indigo-400 font-semibold">{selectedCandidate.targetProfession || "Unspecified Role"}</span> 
                {selectedCandidate.candidatePhone && ` • ${selectedCandidate.candidatePhone}`}
                {selectedCandidate.candidateEmail && ` • ${selectedCandidate.candidateEmail}`}
              </p>
              {selectedCandidate.candidateLinks && selectedCandidate.candidateLinks.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {selectedCandidate.candidateLinks.map((link: string, i: number) => (
                    <a key={i} href={link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate max-w-[150px] inline-block">
                      {new URL(link).hostname}
                    </a>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1">ATS Score: {selectedCandidate.score}% • Ran: {new Date(selectedCandidate.createdAt).toLocaleDateString()}</p>
            </div>
            <button
              onClick={handleAddTalent}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap ml-4"
            >
              Add to Talent Hub
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
