"use client";
import { useEffect, useState } from "react";
import { Users, Mail, Shield, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

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
              className="group relative bg-gray-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-black/20"
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
        <div className="bg-gray-900/60 border border-slate-800/80 rounded-2xl p-6">
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
            <p className="text-lg font-bold text-emerald-400">Online</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/40 border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 border border-slate-800 rounded-xl hover:bg-slate-800/70 hover:border-slate-700 transition-all group"
          >
            <Shield size={16} className="text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Manage User Roles</p>
              <p className="text-xs text-slate-500">Promote, demote, or remove users</p>
            </div>
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 border border-slate-800 rounded-xl hover:bg-slate-800/70 hover:border-slate-700 transition-all group"
          >
            <Mail size={16} className="text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">View Contact Messages</p>
              <p className="text-xs text-slate-500">Read incoming contact form submissions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
