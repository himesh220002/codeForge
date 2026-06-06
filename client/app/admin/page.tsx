"use client";
import { useEffect, useMemo, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminRolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unlocked = localStorage.getItem("adminUnlocked") === "true";
    setIsUnlocked(unlocked);

    if (!unlocked) {
      setLoading(false);
      return;
    }

    async function fetchUsers() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });

        if (!res.ok) {
          throw new Error("Access denied or token invalid");
        }

        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("You must be signed in as an admin to view this page.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error("Role update failed");
      }

      setUsers(users.map(u => (u._id === id ? { ...u, role: newRole } : u)));
      setError("");
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Could not update user role. Please sign in as an admin.");
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
    <div className="mx-auto max-w-7xl">
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Role Management</h2>
      <p className="mb-4 text-sm ">This page is protected with an extra admin password gate and an admin-role token check.</p>

      {!isUnlocked ? (
        <div className="max-w-md rounded border border-gray-200 bg-gray-500 p-4 shadow-sm">
          <label className="mb-2 block text-sm font-semibold">Enter admin password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Admin password"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button
            onClick={handleUnlock}
            className="mt-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Unlock admin panel
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search by name, email, or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 mb-4 w-full"
          />

          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table className="w-full bg-gray-50 border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border text-black text-center border-gray-300 p-1">Name</th>
              <th className="border text-black text-center border-gray-300 p-1">UserId</th>
              <th className="border text-black text-center border-gray-300 p-1">Email</th>
              <th className="border text-black text-center border-gray-300 p-1">Role</th>
              <th className="border text-black text-center border-gray-300 p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user._id}>
                <td className="border text-black text-center border-gray-300 p-1">{user.name}</td>
                <td className="border text-black text-center border-gray-300 p-1">{user._id}</td>
                <td className="border text-black text-center border-gray-300 p-1">{user.email}</td>
                <td className="border text-black text-center border-gray-300 p-1">{user.role}</td>
                <td className="border text-black text-center border-gray-300 p-1">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
            </table>
          )}
        </>
      )}
    </div>
    </div>
  );
}
