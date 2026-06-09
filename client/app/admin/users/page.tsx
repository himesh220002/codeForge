"use client";
import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface TokenPayload {
  userId: string;
  role: "owner" | "superuser" | "admin" | "user";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number } | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = jwtDecode<TokenPayload>(token);
        setCurrentRole(payload.role);
      } catch {
        setCurrentRole(null);
      }
    }
  }, []);

  async function refreshAccessToken(): Promise<string | null> {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          return data.accessToken;
        }
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
    }
    return null;
  }

  async function fetchUsers(page = 1) {
    try {
      let token = localStorage.getItem("accessToken");
      let res = await fetch(`/api/admin/users?page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch(`/api/admin/users?page=${page}&limit=20`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
      }

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminUnlocked");
        setError("Your session has expired or you do not have permission. Please sign in as an admin.");
        return;
      }

      if (!res.ok) throw new Error("Access denied or token invalid");

      const data = await res.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("You must be signed in as an admin to view this page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      let token = localStorage.getItem("accessToken");
      let res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch(`/api/admin/users/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            body: JSON.stringify({ role: newRole }),
          });
        }
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Role update failed");
        return;
      }

      setUsers(users.map(u => (u._id === id ? { ...u, role: newRole } : u)));
      setError("");
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Could not update user role. Please sign in as an admin.");
    }
  };

  const handleDeleteUser = async (id: string, role: string) => {
    if (role !== "user") {
      setError("Only users can be deleted directly. Demote admins first.");
      return;
    }

    try {
      let token = localStorage.getItem("accessToken");
      let res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch(`/api/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to delete user");
        return;
      }

      setUsers(users.filter(u => u._id !== id));
      setError("");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Could not delete user. Please try again.");
    }
  };

  const filtered = useMemo(
    () =>
      users.filter(u =>
        [u.name, u.email, u._id].some(field =>
          field.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [users, search]
  );

  const roleBadge = (role: string) => {
    const styles: Record<string, string> = {
      owner: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
      superuser: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
      admin: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
      user: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
    };
    return styles[role] || styles.user;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
        <p className="text-sm text-slate-400 mt-1">View, search, and manage user roles across the platform.</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-gray-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all text-sm"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/40 border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/80">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-200 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${roleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user._id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          disabled={
                            (user.role === "owner" && currentRole !== "owner") ||
                            (user.role === "superuser" && currentRole !== "owner")
                          }
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="superuser">SuperUser</option>
                          <option value="owner">Owner</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.role)}
                          className="px-2.5 py-1.5 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium hover:bg-red-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          disabled={user.role !== "user"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchUsers(pagination.page - 1)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 text-sm rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchUsers(pagination.page + 1)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 text-sm rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
