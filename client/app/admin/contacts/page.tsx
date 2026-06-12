"use client";
import { useEffect, useState } from "react";
import { Mail, Clock, User as UserIcon, Search } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

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

  async function fetchContacts() {
    try {
      let token = localStorage.getItem("accessToken");
      let res = await fetch("/codeforge/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token || ""}` },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch("/codeforge/api/admin/contacts", {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
      }

      if (res.status === 401 || res.status === 403) {
        setError("Your session has expired or you do not have permission.");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch contacts");

      const data = await res.json();
      setContacts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = contacts.filter(c =>
    [c.name, c.email, c.message].some(field =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Contact Messages</h1>
        <p className="text-sm text-slate-400 mt-1">Incoming contact form submissions from your platform.</p>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-gray-900/60 border border-indigo-500/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all text-sm"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/40 border border-indigo-500/10 rounded-2xl">
          <Mail size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 text-sm">No contact messages found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.map(contact => (
              <button
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedContact?._id === contact._id
                  ? "bg-indigo-500/10 border-indigo-500/30"
                  : "bg-gray-900/40 border-indigo-500/10 hover:bg-slate-800/40 hover:border-indigo-700/20"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserIcon size={12} className="text-slate-500" />
                  <p className="text-sm font-semibold text-slate-200 truncate">{contact.name}</p>
                </div>
                <p className="text-xs text-slate-500 truncate">{contact.email}</p>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{contact.message}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock size={10} className="text-slate-600" />
                  <span className="text-[10px] text-slate-600">{formatDate(contact.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <div className="bg-gray-900/40 border border-indigo-500/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{selectedContact.name}</h3>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-lg">
                    <Clock size={12} />
                    {formatDate(selectedContact.createdAt)}
                  </div>
                </div>
                <div className="border-t border-indigo-500/10 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</p>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-900/20 border border-indigo-500/10/40 rounded-2xl min-h-[300px]">
                <div className="text-center">
                  <Mail size={32} className="mx-auto text-slate-700 mb-2" />
                  <p className="text-sm text-slate-500">Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
