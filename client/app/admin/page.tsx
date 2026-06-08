"use client";
import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import Navbar from "@/components/navbar";
import { Eye, EyeOff } from "lucide-react";

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

export default function AdminRolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
      });
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
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch(`/api/admin/users?page=${page}&limit=20`, {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminUnlocked");
        setIsUnlocked(false);
        setError("Your session has expired or you do not have permission. Please sign in as an admin.");
        return;
      }

      if (!res.ok) {
        throw new Error("Access denied or token invalid");
      }

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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const unlocked = localStorage.getItem("adminUnlocked") === "true";
    setIsUnlocked(unlocked);

    if (!unlocked) {
      setLoading(false);
      return;
    }

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
        // ✅ Show backend message instead of generic error
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
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch(`/api/admin/users/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to delete user");
        return;
      }

      // Remove from state
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

  const handleUnlock = () => {
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin2026";

    if (password === expectedPassword) {
      localStorage.setItem("adminUnlocked", "true");
      setIsUnlocked(true);
      setError("");
      window.location.reload();
      return;
    }

    setError("Incorrect admin password.");
  };

  return (
    <div className="mx-auto bg-zinc-50 font-sans dark:bg-black min-h-screen text-black dark:text-zinc-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <h2 className="text-2xl font-bold mb-4">User Role Management</h2>
        <p className="mb-4 text-sm">This page is protected with an extra admin password gate and an admin-role token check.</p>

        {!isLoggedIn ? (
          <div className="max-w-md rounded border border-red-200 bg-red-50 p-4 shadow-sm text-red-800">
            <p className="mb-3 font-semibold">You must be logged in to view this page.</p>
            <a href="/login" className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Go to Login
            </a>
          </div>
        ) : !isUnlocked ? (

          /* Admin password modal */
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-gray-800 text-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-8 space-y-4">
              <h2 className="text-xl font-semibold text-center mb-2">Admin Access Required</h2>
              <p className="text-sm text-gray-300 text-center mb-4">Enter the admin password to unlock the panel.</p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400 text-center animate-pulse" role="alert">{error}</p>
              )}
              <button
                onClick={handleUnlock}
                className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Unlock Panel
              </button>
            </div>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border p-2 mb-4 w-full text-black rounded"
            />

            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table className="w-full bg-gray-50 border-collapse border">
                <thead>
                  <tr className="bg-gray-200 text-black">
                    <th className="border text-center border-gray-300 p-1">Name</th>
                    <th className="border text-center border-gray-300 p-1">UserId</th>
                    <th className="border text-center border-gray-300 p-1">Email</th>
                    <th className="border text-center border-gray-300 p-1">Role</th>
                    <th className="border text-center border-gray-300 p-1">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {filtered.map(user => (
                    <tr key={user._id}>
                      <td className="border text-center border-gray-300 p-1">{user.name}</td>
                      <td className="border text-center border-gray-300 p-1">{user._id}</td>
                      <td className="border text-center border-gray-300 p-1">{user.email}</td>
                      <td className="border text-center border-gray-300 p-1"><span
                        className={`px-2 py-1 rounded text-xs font-semibold ${user.role === "owner"
                          ? "bg-yellow-500 text-white"
                          : user.role === "superuser"
                            ? "bg-purple-500 text-white"
                            : user.role === "admin"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-black"
                          }`}
                      >
                        {user.role}
                      </span>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteUser(user._id, user.role)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                          disabled={user.role !== "user"} // only allow deleting users
                        >
                          Delete
                        </button>
                      </td>
                      <td className="border text-center border-gray-300 p-1">
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user._id, e.target.value)}
                          className="border p-1 rounded"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {pagination && (
              <div className="flex justify-between items-center mt-4">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                  className="px-3 py-1 bg-blue-200/50 backdrop-blur rounded disabled:opacity-50 disabled:hover:bg-blue-200/50 hover:bg-blue-600 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                  className="px-3 py-1 bg-blue-200/50 backdrop-blur rounded disabled:opacity-50 disabled:hover:bg-blue-200/50 hover:bg-blue-600 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
